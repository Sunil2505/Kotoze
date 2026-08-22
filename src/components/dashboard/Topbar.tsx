"use client";

import { useEffect, useState } from "react";
import {
  Bell,
  LogOut,
  Menu,
  Search,
} from "lucide-react";

import {
  getCurrentUser,
  logout,
  AuthUser,
} from "@/lib/api/auth";

export default function Topbar() {
  const [user, setUser] =
    useState<AuthUser | null>(null);

  const [loggingOut, setLoggingOut] =
    useState(false);

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

  async function handleLogout() {
    try {
      setLoggingOut(true);

      await logout();

      window.location.href = "/login";
    } catch (error) {
      console.error(
        "Logout failed:",
        error
      );

      setLoggingOut(false);
    }
  }

  const fullName = user
    ? `${user.firstName} ${user.lastName}`.trim()
    : "Loading...";

  const roleName =
    user?.roleId?.name ?? "Administrator";

  const initials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase()
    : "...";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 shadow-sm">
      {/* Left Side */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          className="rounded-lg p-2 transition hover:bg-gray-100"
        >
          <Menu size={20} />
        </button>

        <div className="relative hidden md:block">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search..."
            className="h-10 w-80 rounded-lg border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:bg-white"
          />
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-5">
        <button
          type="button"
          className="relative rounded-lg p-2 transition hover:bg-gray-100"
        >
          <Bell size={20} />

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <div className="h-8 w-px bg-gray-200" />

        {/* User */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 font-bold text-white">
            {initials}
          </div>

          <div className="hidden text-left md:block">
            <p className="text-sm font-semibold">
              {fullName}
            </p>

            <p className="text-xs text-gray-500">
              {roleName}
            </p>
          </div>

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            title="Logout"
            className="rounded-lg p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}