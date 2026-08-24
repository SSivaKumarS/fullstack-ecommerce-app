import { useAuthStore } from "@/features/auth/store";
import type { UserRole } from "@/lib/types";
import { useAuth } from "@clerk/react";
import { Navigate, Outlet } from "react-router-dom";
import { Commonloader } from "../common/Loader";

type RoleGuardLayoutProps = {
  allow: UserRole[];
};

export function RoleGuardLayout({ allow }: RoleGuardLayoutProps) {
  const { isBootstrapped, status, user } = useAuthStore();
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded || !isBootstrapped || status === "loading") {
    return <Commonloader />;
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }

  if (!user) {
    return <Commonloader />;
  }

  if (!allow.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
