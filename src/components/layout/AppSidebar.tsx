"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigation } from "@/config/navigation";
import { cn } from "@/lib/utils";

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-72 border-r bg-white lg:flex lg:flex-col">
      {/* Logo */}
      <div className="flex h-20 items-center border-b px-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-emerald-600">
            KOTOZE
          </h1>
          <p className="text-xs text-slate-500">
            Commerce Operating System
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {navigation.map((group) => (
          <div key={group.title} className="mb-8">
            <h2 className="mb-3 px-3 text-xs font-semibold tracking-widest text-slate-400 uppercase">
              {group.title}
            </h2>

            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;

                const active =
                  pathname === item.href ||
                  pathname.startsWith(item.href + "/");

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200",
                      active
                        ? "bg-emerald-50 text-emerald-700"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t p-5">
        <div className="rounded-2xl bg-slate-100 p-4">
          <p className="text-sm font-semibold text-slate-800">
            Kotoze Admin
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Version 1.0.0
          </p>
        </div>
      </div>
    </aside>
  );
}