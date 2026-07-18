"use client";

import { Bell, Menu, Search } from "lucide-react";

export default function Topbar() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 shadow-sm">
      {/* Left Side */}
      <div className="flex items-center gap-4">
        <button className="rounded-lg p-2 transition hover:bg-gray-100">
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
        <button className="relative rounded-lg p-2 transition hover:bg-gray-100">
          <Bell size={20} />

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500"></span>
        </button>

        <div className="h-8 w-px bg-gray-200"></div>

        <button className="flex items-center gap-3 rounded-lg px-2 py-1 transition hover:bg-gray-100">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 font-bold text-white">
            S
          </div>

          <div className="hidden text-left md:block">
            <p className="text-sm font-semibold">
              Super Admin
            </p>

            <p className="text-xs text-gray-500">
              Administrator
            </p>
          </div>
        </button>
      </div>
    </header>
  );
}