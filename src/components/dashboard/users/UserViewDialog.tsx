"use client";

import { X } from "lucide-react";

import { User } from "@/lib/api/user";

interface UserViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
}

export default function UserViewDialog({
  open,
  onOpenChange,
  user,
}: UserViewDialogProps) {
  if (!open || !user) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-lg font-bold leading-6 text-slate-900">
              View User
            </h2>

            <p className="mt-1 text-sm leading-5 text-slate-500">
              User information.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            title="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* User Information */}
        <div className="space-y-5 p-6">
          {/* Role */}
          <div className="w-[120px]">
            <p className="mb-1.5 text-sm font-semibold text-slate-700">
              Role
            </p>

            <div className="flex h-10 items-center rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700">
              {user.roleId?.name ??
                user.roleId?.code ??
                "—"}
            </div>
          </div>

          {/* Name */}
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <p className="mb-1.5 text-sm font-semibold text-slate-700">
                First Name
              </p>

              <div className="flex h-10 items-center rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700">
                {user.firstName || "—"}
              </div>
            </div>

            <div>
              <p className="mb-1.5 text-sm font-semibold text-slate-700">
                Last Name
              </p>

              <div className="flex h-10 items-center rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700">
                {user.lastName || "—"}
              </div>
            </div>
          </div>

          {/* Mobile + Email */}
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <p className="mb-1.5 text-sm font-semibold text-slate-700">
                Mobile
              </p>

              <div className="flex h-10 items-center rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700">
                {user.mobile || "—"}
              </div>
            </div>

            <div>
              <p className="mb-1.5 text-sm font-semibold text-slate-700">
                Email
              </p>

              <div className="flex h-10 items-center rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700">
                {user.email || "—"}
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="w-[120px]">
            <p className="mb-1.5 text-sm font-semibold text-slate-700">
              Status
            </p>

            <div className="flex h-10 items-center rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-700">
              {user.status}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}