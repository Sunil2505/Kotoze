"use client";

import { useState } from "react";
import { AlertTriangle, X } from "lucide-react";

import {
  deleteRole,
  Role,
} from "@/lib/api/role";

interface DeleteConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: Role | null;
  onSuccess: () => void;
}

export default function DeleteConfirmationDialog({
  open,
  onOpenChange,
  role,
  onSuccess,
}: DeleteConfirmationDialogProps) {
  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  if (!open || !role) {
    return null;
  }

  async function handleDelete() {
    if (!role) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      await deleteRole(role._id);

      onSuccess();
    } catch (error: any) {
      console.error(error);

      setError(
        error.message ??
          "Failed to delete role."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-bold text-slate-900">
            Delete Role
          </h2>

          <button
            type="button"
            onClick={() =>
              onOpenChange(false)
            }
            disabled={loading}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
              <AlertTriangle
                size={22}
              />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Delete "{role.name}"?
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                This role will be deactivated
                and will no longer appear in
                the active roles list.
              </p>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() =>
                onOpenChange(false)
              }
              disabled={loading}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="rounded-lg bg-red-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Deleting..."
                : "Delete Role"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}