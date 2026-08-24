import { SignUp } from "@clerk/react";

export function SignUpPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <SignUp routing="path" path="/sign-up" />
    </div>
  );
}
