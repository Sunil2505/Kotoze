"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

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
  FolderDown,
  Settings,
} from "lucide-react";

const menu = [
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
      {
        name: "Export Manager",
        href: "/dashboard/exports",
        icon: FolderDown,
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

  const navRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    navRef.current?.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, [pathname]);

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-72 border-r bg-background">
      <div className="flex h-full flex-col">

        {/* =========================
            LOGO - FIXED
        ========================== */}

        <div className="shrink-0 border-b px-6 py-7">

          <Link href="/dashboard">

            <div className="font-serif text-[30px] font-bold tracking-tight text-emerald-700">
              KOTOZE
            </div>

            <div className="mt-1 font-serif text-[14px] text-muted-foreground">
              Commerce Operating System
            </div>

          </Link>

        </div>

        {/* =========================
            GENERAL - FIXED
        ========================== */}

        <div className="shrink-0 px-4 pt-6">

          <div className="mb-3 px-3 font-serif text-[14px] font-semibold tracking-widest text-slate-400">
            GENERAL
          </div>

          <Link
            href="/dashboard"
            className={`
              flex h-[52px] items-center gap-4
              rounded-2xl px-4
              font-serif text-[16px]
              transition-colors
              ${
                pathname === "/dashboard"
                  ? "bg-emerald-50 text-emerald-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }
            `}
          >

            <LayoutDashboard
              className={`
                h-5 w-5 shrink-0
                ${
                  pathname === "/dashboard"
                    ? "text-emerald-700"
                    : "text-slate-500"
                }
              `}
              strokeWidth={1.8}
            />

            <span>
              Dashboard
            </span>

          </Link>

        </div>

        {/* =========================
            SCROLLABLE NAVIGATION
        ========================== */}

        <div
          ref={navRef}
          className="
            min-h-0
            flex-1
            overflow-y-auto
            px-4
            pt-7
            pb-6
            [scrollbar-width:none]
            [-ms-overflow-style:none]
            [&::-webkit-scrollbar]:hidden
          "
        >

          <nav className="space-y-7">

            {menu.map(
              (section) => (
                <div
                  key={
                    section.title
                  }
                >

                  {/* Section title */}

                  <div className="mb-3 px-3 font-serif text-[14px] font-semibold tracking-widest text-slate-400">
                    {section.title}
                  </div>

                  {/* Menu items */}

                  <div className="space-y-1">

                    {section.items.map(
                      (item) => {

                        const Icon =
                          item.icon;

                        const isActive =
                          pathname ===
                            item.href ||
                          (item.href !==
                            "/dashboard" &&
                            pathname.startsWith(
                              `${item.href}/`
                            ));

                        return (
                          <Link
                            key={
                              item.href
                            }
                            href={
                              item.href
                            }
                            className={`
                              flex h-[52px] items-center gap-4
                              rounded-2xl px-4
                              font-serif text-[16px]
                              transition-colors
                              ${
                                isActive
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                              }
                            `}
                          >

                            <Icon
                              className={`
                                h-5 w-5 shrink-0
                                ${
                                  isActive
                                    ? "text-emerald-700"
                                    : "text-slate-500"
                                }
                              `}
                              strokeWidth={
                                1.8
                              }
                            />

                            <span>
                              {
                                item.name
                              }
                            </span>

                          </Link>
                        );
                      }
                    )}

                  </div>

                </div>
              )
            )}

          </nav>

        </div>

        {/* =========================
            ADMIN CARD - FIXED
        ========================== */}

        <div className="shrink-0 border-t bg-background p-4">

          <div className="flex items-center gap-3 rounded-2xl bg-slate-100 px-4 py-4">

            {/* Avatar */}

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-500 font-serif text-sm font-semibold text-white">
              SA
            </div>

            {/* User info */}

            <div className="min-w-0 flex-1">

              <div className="truncate font-serif text-[15px] font-semibold text-slate-800">
                Kotoze Admin
              </div>

              <div className="mt-0.5 font-serif text-xs text-slate-500">
                Version 2.0
              </div>

            </div>

          </div>

        </div>

      </div>
    </aside>
  );
}