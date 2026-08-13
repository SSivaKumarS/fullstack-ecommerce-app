import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { confirmCheckout } from "../../features/customer/cart-and-checkout/api";
import { useCustomerCartAndCheckoutStore } from "../../features/customer/cart-and-checkout/store";
import { useAuth } from "@clerk/react";

const pageWrapClass =
  "flex min-h-screen items-center justify-center bg-background px-4";
const cardClass =
  "w-full max-w-xl space-y-5 border border-border bg-card p-8 text-center";
const iconWrapClass =
  "mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary";
const titleClass = "text-2xl font-semibold text-foreground";
const textClass = "text-sm text-muted-foreground";
const buttonRowClass = "flex flex-col gap-3 sm:flex-row sm:justify-center";
const buttonClass = "rounded-none";

export default function CustomerOrderSuccessPage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");
  const [loading, setLoading] = useState(Boolean(orderId));
  const [error, setError] = useState<string | null>(null);
  const { loadCart } = useCustomerCartAndCheckoutStore();

  const { isLoaded } = useAuth();

  useEffect(() => {
    if (!orderId) {
      setError("Missing order id for payment verification");
      setLoading(false);
      return;
    }

    if (!isLoaded) return;

    let active = true;

    async function verifyPayment() {
      try {
        await confirmCheckout({ orderId: orderId! });
        if (active) {
          setLoading(false);
          // Reload the cart to reflect that it is now empty
          void loadCart(true);
        }
      } catch (err) {
        if (active) {
          const message = err instanceof Error ? err.message : "Payment verification failed";
          setError(message);
          setLoading(false);
        }
      }
    }

    void verifyPayment();

    return () => {
      active = false;
    };
  }, [orderId, isLoaded, loadCart]);

  if (loading) {
    return (
      <div className={pageWrapClass}>
        <div className={cardClass}>
          <div className="mx-auto flex h-16 w-16 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
          <div className="space-y-2">
            <h1 className={titleClass}>Confirming your payment...</h1>
            <p className={textClass}>
              Please wait while we verify your transaction status. Do not close or refresh this page.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={pageWrapClass}>
        <div className={cardClass}>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <AlertCircle className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h1 className={titleClass}>Payment Verification Failed</h1>
            <p className="text-sm text-destructive">{error}</p>
            <p className={textClass}>
              There was an issue verifying your payment. If money was deducted, please contact support.
            </p>
          </div>
          <div className={buttonRowClass}>
            <Button asChild variant="outline" className={buttonClass}>
              <Link to="/">Go to home</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={pageWrapClass}>
      <div className={cardClass}>
        <div className={iconWrapClass}>
          <CheckCircle2 className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <h1 className={titleClass}>Order placed successfully</h1>
          <p className={textClass}>
            Your payment is complete and your order is confirmed.
          </p>
        </div>

        <div className={buttonRowClass}>
          <Button asChild className={buttonClass}>
            <Link to="/collections">Continue shopping</Link>
          </Button>

          <Button asChild variant="outline" className={buttonClass}>
            <Link to="/">Go to home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
