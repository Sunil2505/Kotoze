"use client";

import { FormEvent, useEffect, useState } from "react";
import { X } from "lucide-react";

import {
  createRole,
  updateRole,
  Role,
} from "@/lib/api/role";

type DialogMode = "add" | "edit" | "view";

interface RoleFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: Role | null;
  mode: DialogMode;
  onSuccess: () => void;
}

export default function RoleFormDialog({
  open,
  onOpenChange,
  role,
  mode,
  onSuccess,
}: RoleFormDialogProps) {
  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isAdd = mode === "add";

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) {
      return;
    }

    setError("");

    if (role) {
      setName(role.name);
      setCode(role.code);
      setDescription(role.description ?? "");
      setIsActive(role.isActive);
    } else {
      setName("");
      setCode("");
      setDescription("");
      setIsActive(true);
    }
  }, [open, role]);

  if (!open) {
    return null;
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (isView) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      const trimmedName = name.trim();
      const trimmedCode = code.trim().toUpperCase();
      const trimmedDescription = description.trim();

      if (!trimmedName) {
        setError("Role name is required.");
        return;
      }

      if (!trimmedCode) {
        setError("Role code is required.");
        return;
      }

      if (isEdit && role) {
        await updateRole(role._id, {
          name: trimmedName,
          code: trimmedCode,
          description: trimmedDescription,
          isActive,
        });
      } else if (isAdd) {
        await createRole({
          name: trimmedName,
          code: trimmedCode,
          description: trimmedDescription,
          isSystem: false,
          isActive,
        });
      }

      onSuccess();
    } catch (error: any) {
      console.error(error);

      setError(
        error?.message ?? "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
        {/* =========================
            HEADER
        ========================== */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {isView
                ? "View Role"
                : isEdit
                  ? "Edit Role"
                  : "Add Role"}
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              {isView
                ? "View role information."
                : isEdit
                  ? "Update role information."
                  : "Create a new custom role."}
            </p>
          </div>

          {/* Only X button */}
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* =========================
            FORM
        ========================== */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-6"
        >
          {/* Error */}
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Role Name */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
              Role Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              placeholder="e.g. Manager"
              disabled={loading || isView}
              className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-emerald-500 disabled:cursor-not-allowed disabled:bg-slate-100"
            />
          </div>

          {/* Role Code */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
              Role Code
            </label>

            <input
              type="text"
              value={code}
              onChange={(event) =>
                setCode(
                  event.target.value.toUpperCase()
                )
              }
              placeholder="e.g. MANAGER"
              disabled={
                loading ||
                isView ||
                Boolean(role?.isSystem)
              }
              className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 font-mono text-sm uppercase outline-none transition focus:border-emerald-500 disabled:cursor-not-allowed disabled:bg-slate-100"
            />

            {role?.isSystem && (
              <p className="mt-1.5 text-xs text-slate-400">
                System role code cannot be changed.
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
              Description
            </label>

            <textarea
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              placeholder="Describe this role..."
              rows={3}
              disabled={loading || isView}
              className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-emerald-500 disabled:cursor-not-allowed disabled:bg-slate-100"
            />
          </div>

          {/* Active Status */}
          <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
            <div>
              <p className="text-sm font-semibold text-slate-700">
                Active Status
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Inactive roles cannot be used for new
                assignments.
              </p>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={isActive}
              onClick={() =>
                setIsActive(
                  (previous) => !previous
                )
              }
              disabled={loading || isView}
              className={`relative h-6 w-11 rounded-full transition ${
                isActive
                  ? "bg-emerald-600"
                  : "bg-slate-300"
              } ${
                isView
                  ? "cursor-not-allowed opacity-70"
                  : ""
              }`}
            >
              <span
                className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${
                  isActive
                    ? "left-6"
                    : "left-1"
                }`}
              />
            </button>
          </div>

          {/* =========================
              BOTTOM ACTION
              View = Nothing
              Edit = Update Role
              Add = Create Role
          ========================== */}
          {!isView && (
            <div className="flex justify-end border-t border-slate-200 pt-5">
              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-emerald-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? "Saving..."
                  : isEdit
                    ? "Update Role"
                    : "Create Role"}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}