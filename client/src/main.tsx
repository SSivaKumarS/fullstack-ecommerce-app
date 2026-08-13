import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ClerkProvider } from "@clerk/react";
import { Toaster } from "./components/ui/sonner.tsx";

const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const root = createRoot(document.getElementById("root")!);

if (!clerkPublishableKey) {
  root.render(
    <div className="min-h-screen bg-background px-6 py-10 text-foreground">
      <div className="mx-auto max-w-xl space-y-3 rounded-lg border bg-card p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">Missing Clerk setup</h1>
        <p className="text-muted-foreground">
          Add your Clerk publishable key to client/.env as
          VITE_CLERK_PUBLISHABLE_KEY, then restart the frontend.
        </p>
      </div>
    </div>,
  );
} else {
  root.render(
    <ClerkProvider
      publishableKey={clerkPublishableKey}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
    >
      <App />
      <Toaster />
    </ClerkProvider>,
  );
}
