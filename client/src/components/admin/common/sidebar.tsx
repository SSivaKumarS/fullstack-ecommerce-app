import {
  BadgePercent,
  BarChart3,
  LayoutDashboard,
  Package,
  Settings2,
  Store,
  X,
  type LucideIcon,
} from "lucide-react";
import { NavLink } from "react-router-dom";

type AdminNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

type AdminSidebarProps = {
  open: boolean;
  onClose: () => void;
};

const items: AdminNavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Coupons", href: "/admin/coupons", icon: BadgePercent },
  { label: "Orders", href: "/admin/orders", icon: BarChart3 },
  { label: "Settings", href: "/admin/settings", icon: Settings2 },
];

const sidebarRoot =
  "fixed inset-y-0 left-0 z-50 flex w-[280px] shrink-0 flex-col border-r border-sidebar-border bg-sidebar transition-transform duration-300 ease-in-out lg:static lg:z-auto lg:w-[280px] lg:translate-x-0";

const brandRow =
  "flex h-[72px] items-center justify-between border-b border-sidebar-border px-5";
const navWrap = "space-y-2 px-3 py-4";
const navItemBase =
  "flex h-11 items-center gap-3 rounded-md px-4 text-[15px] font-medium transition-colors";

const activeItem = "bg-sidebar-primary text-sidebar-primary-foreground";
const idleItem =
  "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground";

function SidebarNav({ onClose }: { onClose: () => void }) {
  return (
    <nav className={navWrap}>
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <NavLink
            key={item.label}
            to={item.href}
            end={item.href === "/admin"}
            onClick={onClose}
            className={({ isActive }: { isActive: boolean }) =>
              `${navItemBase} ${isActive ? activeItem : idleItem}`
            }
          >
            <Icon className="h-[18px] w-[18px]" />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}

export function AdminSidebar({ open, onClose }: AdminSidebarProps) {
  return (
    <aside
      className={`${sidebarRoot} ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
    >
      <div className={brandRow}>
        <div className="flex items-center gap-3">
          <Store className="h-8 w-8" />
          <span className="text-[20px] font-semibold text-foreground">
            Zenvora
          </span>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-sidebar-border text-sidebar-foreground lg:hidden"
          aria-label="Close sidebar"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <SidebarNav onClose={onClose} />
      </div>
    </aside>
  );
}
