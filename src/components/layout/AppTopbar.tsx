"use client";

import { useEffect, useState } from "react";
import {
  Bell,
  Moon,
  Search,
} from "lucide-react";

import {
  getCurrentUser,
  AuthUser,
} from "@/lib/api/auth";

export default function AppTopbar() {
  const [user, setUser] =
    useState<AuthUser | null>(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const response =
          await getCurrentUser();

        setUser(response.user);
      } catch (error) {
        console.error(
          "Failed to load current user:",
          error
        );
      }
    }

    loadUser();
  }, []);

  const fullName = user
    ? `${user.firstName} ${user.lastName}`.trim()
    : "Loading...";

  const roleCode =
    user?.roleId?.code;

  const displayName =
    roleCode === "SUPER_ADMIN"
      ? "Super Admin"
      : roleCode === "ADMIN"
        ? "Admin"
        : fullName;

  const roleName =
    user?.roleId?.name ??
    "Administrator";

  const initials =
    roleCode === "SUPER_ADMIN"
      ? "SA"
      : roleCode === "ADMIN"
        ? "A"
        : user
          ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase()
          : "...";

  return (
    <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b bg-white px-8">

      {/* Search */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

        <input
          type="text"
          placeholder="Search anything..."
          className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm outline-none transition-all focus:border-emerald-500 focus:bg-white"
        />
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">

        {/* Dark Mode */}
        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 transition hover:bg-slate-100"
        >
          <Moon className="h-5 w-5" />
        </button>

        {/* Notifications */}
        <button
          type="button"
          className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 transition hover:bg-slate-100"
        >
          <Bell className="h-5 w-5" />

          <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500" />
        </button>

        {/* User */}
        <div className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 px-3 py-2 transition hover:bg-slate-50">

          {/* Avatar */}
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-sm font-semibold text-white">
            {initials}
          </div>

          {/* User Info */}
          <div className="hidden text-left md:block">
            <p className="text-sm font-semibold text-slate-800">
              {displayName}
            </p>

            <p className="text-xs text-slate-500">
              {roleName}
            </p>
          </div>

        </div>
      </div>
    </header>
  );
}