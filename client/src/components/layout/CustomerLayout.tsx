import { Outlet } from "react-router-dom";
import { CustomerNavbar } from "../customer/common/desktop-navbar";

export function CustomerLayout() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      {/* navbar */}
      <CustomerNavbar />
      <main className="mx-auto w-full max-w-7xl px-3 py-5 sm:px-4 sm:py-8">
        <Outlet />
      </main>
    </div>
  );
}
