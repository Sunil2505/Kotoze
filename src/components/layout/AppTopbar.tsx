"use client";

import { Bell, Moon, Search } from "lucide-react";

export default function AppTopbar() {
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
        <button className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 hover:bg-slate-100 transition">
          <Moon className="h-5 w-5" />
        </button>

        {/* Notifications */}
        <button className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 hover:bg-slate-100 transition">
          <Bell className="h-5 w-5" />

          <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500" />
        </button>

        {/* User */}
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-3 py-2 hover:bg-slate-50 cursor-pointer transition">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-sm font-semibold text-white">
            S
          </div>

          <div className="hidden text-left md:block">
            <p className="text-sm font-semibold text-slate-800">
              Sunil Kumar
            </p>

            <p className="text-xs text-slate-500">
              Super Admin
            </p>
          </div>
        </div>

      </div>
    </header>
  );
}