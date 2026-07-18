"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { SidebarItem as SidebarItemType } from "@/types/sidebar";

interface SidebarItemProps {
  item: SidebarItemType;
}

export default function SidebarItem({
  item,
}: SidebarItemProps) {
  const pathname = usePathname();

  if (!item.href || !item.icon) {
    return null;
  }

  const Icon = item.icon;

  const isActive =
    pathname === item.href ||
    pathname.startsWith(`${item.href}/`);

  return (
    <Link
      href={item.href}
      className={[
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        isActive
          ? "bg-emerald-500 text-white"
          : "text-slate-300 hover:bg-slate-800 hover:text-white",
      ].join(" ")}
    >
      <Icon className="h-5 w-5" />

      <span>{item.title}</span>
    </Link>
  );
}