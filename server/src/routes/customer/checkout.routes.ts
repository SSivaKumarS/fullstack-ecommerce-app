import { Router, type Request, type Response } from "express";
import { Types } from "mongoose";
import { Product, ProductSize } from "../../models/Product";
import { getDbUserFromReq, requireAuth } from "../../middleware/auth";
import { asyncHandler } from "../../utils/asyncHandler";
import { requireFound, requireText } from "../../utils/helpers";
import { User } from "../../models/User";
import { Cart } from "../../models/Cart";
import { AppError } from "../../utils/AppError";
import { Promo } from "../../models/Promo";
import crypto from "crypto";
import { razorpay, razorpayKeySecret, razorpayKeyId } from "../../utils/razorpay";
import { Order } from "../../models/Order";
import { ok } from "../../utils/envelope";

type UserAddressRow = {
  _id: Types.ObjectId;
  fullName: string;
  address: string;
  state: string;
  postalCode: string;
};

type CheckoutUserRow = {
  _id: Types.ObjectId;
  name?: string;
  email?: string;
  addresses: UserAddressRow[];
};

type CartRow = {
  items: Array<{
    product: Types.ObjectId;
    quantity: number;
    color?: string;
    size?: ProductSize;
  }>;
};

type ProductRow = {
  _id: Types.ObjectId;
  price: number;
  salePercentage: number;
  stock: number;
  status: "active" | "inactive";
};

type PromoRow = {
  code: string;
  percentage: number;
  count: number;
  minimumOrderValue: number;
  startsAt: Date;
  endsAt: Date;
};

export const customerCheckoutRouter = Router();

customerCheckoutRouter.use(requireAuth);

customerCheckoutRouter.post(
  "/checkout/create-session",
  asyncHandler(async (req: Request, res: Response) => {
    const dbUser = await getDbUserFromReq(req);
    const addressId = String(req.body.addressId || "").trim();
    const promoCode = String(req.body.promoCode || "")
      .trim()
      .toUpperCase();

    requireText(addressId, "Address is required");

    //get user and cart info

    const [user, cart] = await Promise.all([
      User.findById(dbUser._id)
        .select("name email addresses")
        .lean<CheckoutUserRow | null>(),

      Cart.findOne({ user: dbUser._id }).select("items").lean<CartRow | null>(),
    ]);

    const foundUser = requireFound(user, "user not found", 404);
    const foundCart = requireFound(cart, "Cart not found", 404);

    if (!foundCart.items.length) {
      throw new AppError(400, "Cart is empty");
    }

    const selectedAddress = foundUser.addresses.find(
      (item) => String(item._id) === addressId,
    );

    if (!selectedAddress) {
      throw new AppError(404, "Address not found!!");
    }

    const products = await Product.find({
      _id: { $in: foundCart.items.map((item) => item.product) },
    })
      .select("price salePercentage stock status")
      .lean<ProductRow[]>();

    const productMap = new Map(
      products.map((item) => [String(item._id), item]),
    );

    let totalItems = 0;
    let subTotal = 0;

    const items = foundCart.items.map((cartItem) => {
      const product = productMap.get(String(cartItem.product));

      if (!product || product.status !== "active") {
        throw new AppError(400, "One or more cart items are not avaibale");
      }

      if (product.stock < cartItem.quantity) {
        throw new AppError(400, "Cart items are out of stock");
      }

      const finalPrice = product.salePercentage
        ? Math.round(
            product.price - (product.price * product.salePercentage) / 100,
          )
        : product.price;

      totalItems += cartItem.quantity;
      subTotal += finalPrice * cartItem.quantity;

      return {
        product: cartItem.product,
        quantity: cartItem.quantity,
      };
    });

    let appliedPromoCode = "";
    let discountAmount = 0;

    if (promoCode) {
      const promo = await Promo.findOne({ code: promoCode })
        .select("code percentage count minimumOrderValue startsAt endsAt")
        .lean<PromoRow | null>();

      const foundPromo = requireFound(promo, "Promo not found", 404);
      const now = new Date();

      if (
        now < foundPromo.startsAt ||
        now > foundPromo.endsAt ||
        foundPromo.count < 1
      ) {
        throw new AppError(400, "promo code is not active");
      }

      if (subTotal < foundPromo.minimumOrderValue) {
        throw new AppError(
          400,
          "Minimum order value for this promo is not at the threesold",
        );
      }

      appliedPromoCode = foundPromo.code;
      discountAmount = Math.round((subTotal * foundPromo.percentage) / 100);
    }

    const totalAmount = Math.max(subTotal - discountAmount, 0);

    if (totalAmount < 1) {
      throw new AppError(400, "Razorpay checkout requires a payable order total");
    }

    const receiptId = `order_${new Types.ObjectId().toString()}`;

    const razorpayOrder = (await razorpay.orders.create({
      amount: totalAmount * 100,
      currency: "INR",
      receipt: receiptId,
      notes: {
        user_id: String(dbUser._id),
      },
    })) as {
      id: string;
      amount: number;
      currency: string;
    };

    const deliveryAddress = [
      selectedAddress.address,
      selectedAddress.state,
      selectedAddress.postalCode,
    ]
      .filter(Boolean)
      .join(", ");

    const order = await Order.create({
      user: dbUser._id,
      customerName: foundUser.name || selectedAddress.fullName,
      customerEmail: foundUser.email || "",
      items,
      totalItems,
      deliveryName: selectedAddress.fullName,
      deliveryAddress,
      promoCode: appliedPromoCode,
      discountAmount,
      totalAmount,
      paymentStatus: "pending",
      orderStatus: "placed",
      paymentGatewayOrderId: razorpayOrder.id,
    });

    res.json(
      ok({
        razorpay: {
          keyId: razorpayKeyId,
          orderId: String(order._id),
          razorpayOrderId: razorpayOrder.id,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
        },
        order: {
          _id: String(order._id),
          totalItems,
          discountAmount,
          totalAmount,
        },
      }),
    );
  }),
);

customerCheckoutRouter.post(
  "/checkout/confirm",
  asyncHandler(async (req: Request, res: Response) => {
    const dbUser = await getDbUserFromReq(req);
    const orderId = String(req.body.orderId || "").trim();

    requireText(orderId, "Order id is needed");

    const order = await Order.findOne({
      $or: [
        { _id: Types.ObjectId.isValid(orderId) ? new Types.ObjectId(orderId) : undefined },
        { paymentGatewayOrderId: orderId },
      ].filter(Boolean),
      user: dbUser._id,
    });
    const foundOrder = requireFound(order, "Order not found", 404);

    if (foundOrder.paymentStatus === "paid") {
      res.json(ok({ _id: String(foundOrder._id) }));
      return;
    }

    const razorpayOrderId = foundOrder.paymentGatewayOrderId;
    const razorpayPaymentId = String(req.body.razorpayPaymentId || "").trim();
    const razorpayOrderIdFromClient = String(req.body.razorpayOrderId || "").trim();
    const razorpaySignature = String(req.body.razorpaySignature || "").trim();

    if (razorpayPaymentId || razorpayOrderIdFromClient || razorpaySignature) {
      if (!razorpayPaymentId || !razorpayOrderIdFromClient || !razorpaySignature) {
        throw new AppError(400, "Incomplete Razorpay payment verification details");
      }

      if (razorpayOrderId !== razorpayOrderIdFromClient) {
        throw new AppError(400, "Razorpay order mismatch");
      }

      const expectedSignature = crypto
        .createHmac("sha256", razorpayKeySecret)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest("hex");

      if (expectedSignature !== razorpaySignature) {
        throw new AppError(400, "Invalid payment signature");
      }

      let payment = await razorpay.payments.fetch(razorpayPaymentId);
      if (payment.order_id !== razorpayOrderId) {
        throw new AppError(400, "Payment not confirmed by Razorpay");
      }

      if (payment.status === "authorized" && !payment.captured) {
        payment = await razorpay.payments.capture(
          razorpayPaymentId,
          payment.amount,
          payment.currency,
        );
      }

      if (payment.status !== "captured" || !payment.captured) {
        throw new AppError(400, "Payment not confirmed by Razorpay");
      }

      foundOrder.paymentId = payment.id;
    } else {
      const fetchedOrder = await razorpay.orders.fetch(razorpayOrderId);
      if (fetchedOrder.status !== "paid") {
        throw new AppError(400, "Payment not completed");
      }

      const paymentList = await razorpay.orders.fetchPayments(razorpayOrderId);
      const paidPayment = paymentList.items.find(
        (item: { status: string }) => item.status === "captured",
      );
      if (paidPayment) {
        foundOrder.paymentId = paidPayment.id;
      }
    }

    for (const item of foundOrder.items) {
      const updated = await Product.updateOne(
        {
          _id: item.product,
          stock: { $gte: item.quantity },
        },
        {
          $inc: { stock: -item.quantity },
        },
      );

      if (!updated.matchedCount) {
        throw new AppError(400, "One or more cart items are out of stock");
      }
    }

    if (foundOrder.promoCode) {
      await Promo.updateOne(
        {
          code: foundOrder.promoCode,
          count: { $gt: 0 },
        },
        {
          $inc: { count: -1 },
        },
      );
    }

    await Cart.updateOne({ user: dbUser._id }, { $set: { items: [] } });

    foundOrder.paymentStatus = "paid";
    if (!foundOrder.paymentId) {
      foundOrder.paymentId = foundOrder.paymentGatewayOrderId;
    }
    foundOrder.paidAt = new Date();
    await foundOrder.save();

    res.json(ok({ _id: String(foundOrder._id) }));
  }),
);
