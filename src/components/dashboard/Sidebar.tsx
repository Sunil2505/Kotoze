"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Store,
 FolderTree,
  Tags,
  Package,
  Boxes,
  ShoppingCart,
  BarChart3,
  Settings,
} from "lucide-react";

const menu = [
  {
    title: "GENERAL",
    items: [
      {
        name: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },

  {
    title: "MANAGEMENT",
    items: [
      {
        name: "Users",
        href: "/dashboard/users",
        icon: Users,
      },
      {
        name: "Roles",
        href: "/dashboard/roles",
        icon: ShieldCheck,
      },
      {
        name: "Vendors",
        href: "/dashboard/vendors",
        icon: Store,
      },
    ],
  },

  {
    title: "CATALOG",
    items: [
      {
        name: "Categories",
        href: "/dashboard/categories",
        icon: FolderTree,
      },
      {
        name: "Brands",
        href: "/dashboard/brands",
        icon: Tags,
      },
      {
        name: "Products",
        href: "/dashboard/products",
        icon: Package,
      },
      {
        name: "Inventory",
        href: "/dashboard/inventory",
        icon: Boxes,
      },
    ],
  },

  {
    title: "SALES",
    items: [
      {
        name: "Orders",
        href: "/dashboard/orders",
        icon: ShoppingCart,
      },
    ],
  },

  {
    title: "REPORTS",
    items: [
      {
        name: "Reports",
        href: "/dashboard/reports",
        icon: BarChart3,
      },
    ],
  },

  {
    title: "SETTINGS",
    items: [
      {
        name: "Settings",
        href: "/dashboard/settings",
        icon: Settings,
      },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-72 flex-col border-r border-slate-200 bg-white">
      {/* Logo */}
      <div className="border-b border-slate-200 px-6 py-6">
        <h1 className="text-3xl font-bold tracking-tight text-emerald-600">
          KOTOZE
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Commerce Operating System
        </p>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {menu.map((group) => (
          <div key={group.title} className="mb-8">
            <p className="mb-3 px-3 text-xs font-bold uppercase tracking-widest text-slate-400">
              {group.title}
            </p>

            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;

                const active =
                  pathname === item.href ||
                  pathname.startsWith(item.href + "/");

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                      active
                        ? "bg-emerald-50 text-emerald-700"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <Icon size={19} />

                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-slate-200 p-5">
        <div className="rounded-2xl bg-slate-100 p-4">
          <p className="text-sm font-semibold text-slate-800">
            Kotoze Admin
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Version 2.0
          </p>
        </div>
      </div>
    </aside>
  );
}