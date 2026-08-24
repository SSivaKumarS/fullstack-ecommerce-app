import { useAuthStore } from "@/features/auth/store";
import { useAuth } from "@clerk/react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Commonloader } from "../common/Loader";

export function ProtectedLayout() {
  const { isLoaded, isSignedIn, userId } = useAuth();
  const { isBootstrapped, status, user } = useAuthStore();
  const location = useLocation();

  console.log("========== AUTH DEBUG ==========");
  console.log("Clerk isLoaded:", isLoaded);
  console.log("Clerk isSignedIn:", isSignedIn);
  console.log("Clerk userId:", userId);
  console.log("Auth bootstrapped:", isBootstrapped);
  console.log("Auth status:", status);
  console.log("Application user:", user);
  console.log("Application role:", user?.role);
  console.log("Current path:", location.pathname);
  console.log("================================");

  // 1. Wait for Clerk to finish loading
  if (!isLoaded) {
    return <Commonloader />;
  }

  // 2. User is not authenticated
  if (!isSignedIn) {
    return (
      <Navigate
        to="/admin/dashboard"
        replace
        state={{
          from: `${location.pathname}${location.search}`,
        }}
      />
    );
  }

  // 3. Wait for your application user to load
  if (!isBootstrapped || status === "loading") {
    return <Commonloader />;
  }

  // 4. Authentication successful
  return <Outlet />;
}