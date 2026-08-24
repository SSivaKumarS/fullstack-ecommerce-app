import { SignIn } from "@clerk/react";
import { useLocation } from "react-router-dom";

type LocationState = {
  from?: string;
};

export function SignInPage() {
  const location = useLocation();
  const from = (location.state as LocationState | null)?.from || "/";

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <SignIn
        routing="path"
        path="/sign-in"
        fallbackRedirectUrl={from}
        signUpFallbackRedirectUrl={from}
      />
    </div>
  );
}
