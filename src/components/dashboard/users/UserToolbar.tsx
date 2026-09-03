"use client";

import { Plus, Search } from "lucide-react";

interface UserToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  onAddUser: () => void;
}

export default function UserToolbar({
  search,
  onSearchChange,
  onAddUser,
}: UserToolbarProps) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
      {/* Search */}
      <div className="relative w-full md:max-w-md">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          value={search}
          onChange={(event) =>
            onSearchChange(event.target.value)
          }
          placeholder="Search users..."
          className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:bg-white"
        />
      </div>

      {/* Add User */}
      <button
        type="button"
        onClick={onAddUser}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white transition hover:bg-emerald-700"
      >
        <Plus size={18} />

        <span>Add User</span>
      </button>
    </div>
  );
}