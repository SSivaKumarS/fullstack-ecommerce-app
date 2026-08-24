import { Router } from "express";
import {
  getVerifiedClerkEmail,
  isAdminClerkUser,
  requireAuth,
} from "../../middleware/auth";
import { asyncHandler } from "../../utils/asyncHandler";
import { clerkClient, getAuth } from "@clerk/express";
import { AppError } from "../../utils/AppError";
import { User } from "../../models/User";
import { ok } from "../../utils/envelope";

export const authRouter = Router();

authRouter.post(
  "/sync",
  requireAuth,

  asyncHandler(async (req, res) => {
    const { userId } = getAuth(req);

    if (!userId) {
      throw new AppError(401, "User is not logged in. Means unauth user! !");
    }

    const clerkUser = await clerkClient.users.getUser(userId);

    const email = await getVerifiedClerkEmail(userId);

    const fullName = [clerkUser.firstName, clerkUser.lastName]
      .filter(Boolean)
      .join(" ")
      .trim();

    const name = fullName || clerkUser.username;

    const nextRole = (await isAdminClerkUser(userId)) ? "admin" : "user";

    const newlyCreatedDbUser = await User.findOneAndUpdate(
      {
        clerkUserId: userId,
      },
      {
        clerkUserId: userId,
        email,
        name,
        role: nextRole,
      },
      {
        returnDocument: "after",
        upsert: true,
        setDefaultsOnInsert: true,
      },
    );

    res.status(200).json(
      ok({
        user: {
          id: newlyCreatedDbUser._id,
          clerkUserId: newlyCreatedDbUser.clerkUserId,
          email: newlyCreatedDbUser.email,
          name: newlyCreatedDbUser.name,
          role: newlyCreatedDbUser.role,
        },
      }),
    );
  }),
);

authRouter.get(
  "/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    res.set("Cache-Control", "no-store");

    const { userId } = getAuth(req);

    if (!userId) {
      throw new AppError(401, "User is not logged in. Means unauth user! !");
    }

    const dbUser = await User.findOne({ clerkUserId: userId });

    if (!dbUser) {
      throw new AppError(404, "User is not found in DB");
    }

    const email = await getVerifiedClerkEmail(userId);
    const currentRole = (await isAdminClerkUser(userId)) ? "admin" : "user";

    if (dbUser.role !== currentRole) {
      dbUser.role = currentRole;
      await dbUser.save();
    }

    res.status(200).json(
      ok({
        user: {
          id: dbUser._id,
          clerkUserId: dbUser.clerkUserId,
          email: dbUser.email,
          name: dbUser.name,
          role: currentRole,
        },
      }),
    );
  }),
);
