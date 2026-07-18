"use client";

import { LogOut } from "lucide-react";

export default function SidebarFooter() {
  return (
    <div className="border-t border-slate-800 p-4">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 font-bold text-white">
          S
        </div>

        <div>
          <p className="text-sm font-medium text-white">
            Super Admin
          </p>

          <p className="text-xs text-slate-400">
            Administrator
          </p>
        </div>
      </div>

      <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-slate-300 transition hover:bg-slate-800 hover:text-white">
        <LogOut size={18} />
        Logout
      </button>
    </div>
  );
}