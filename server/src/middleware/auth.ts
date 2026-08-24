import { clerkClient, getAuth } from "@clerk/express";
import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import { User } from "../models/User";
import { asyncHandler } from "../utils/asyncHandler";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "siddannagarisiva2005@gmail.com")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const { userId } = getAuth(req);

  if (!userId) {
    return next(
      new AppError(401, "User is not logged in. Means unauth user! !"),
    );
  }

  next();
}

export async function getDbUserFromReq(req: Request) {
  const { userId } = getAuth(req);

  if (!userId) {
    throw new AppError(401, "User is not logged in. Means unauth user! !");
  }

  const dbUser = await User.findOne({ clerkUserId: userId });
  if (!dbUser) {
    throw new AppError(404, "User is not found in the DB");
  }

  return dbUser;
}

export async function getVerifiedClerkEmail(userId: string) {
  const clerkUser = await clerkClient.users.getUser(userId);
  const primaryEmail =
    clerkUser.emailAddresses.find(
      (item: { id: string }) => item.id === clerkUser.primaryEmailAddressId,
    ) || clerkUser.emailAddresses[0];

  return primaryEmail?.emailAddress?.trim().toLowerCase() || null;
}

export function isAdminEmail(email: string | null | undefined) {
  return ADMIN_EMAILS.includes(email?.trim().toLowerCase() || "");
}

function hasAdminRole(metadata: unknown) {
  if (!metadata || typeof metadata !== "object") return false;

  const role = (metadata as { role?: unknown }).role;
  return typeof role === "string" && role.trim().toLowerCase() === "admin";
}

export async function isAdminClerkUser(userId: string) {
  const clerkUser = await clerkClient.users.getUser(userId);
  const email = await getVerifiedClerkEmail(userId);

  return (
    isAdminEmail(email) ||
    hasAdminRole(clerkUser.publicMetadata) ||
    hasAdminRole(clerkUser.privateMetadata) ||
    hasAdminRole(clerkUser.unsafeMetadata)
  );
}

// admin gate
//user logged in user + admin access

export const requireAdmin = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    const { userId } = getAuth(req);

    if (!userId) {
      throw new AppError(401, "User is not logged in. Means unauth user! !");
    }

    if (!(await isAdminClerkUser(userId))) {
      throw new AppError(403, "Admin access only");
    }

    next();
  },
);
