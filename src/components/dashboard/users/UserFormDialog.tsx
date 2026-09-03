"use client";

import { FormEvent, useEffect, useState } from "react";
import { X } from "lucide-react";

import {
  createUser,
  updateUser,
  User,
} from "@/lib/api/user";

import {
  getRoles,
  Role,
} from "@/lib/api/role";

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onSuccess: () => void;
}

export default function UserFormDialog({
  open,
  onOpenChange,
  user,
  onSuccess,
}: UserFormDialogProps) {
  const isEdit = Boolean(user);

  const [roles, setRoles] = useState<Role[]>([]);
  const [rolesLoading, setRolesLoading] =
    useState(false);

  const [roleId, setRoleId] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] =
    useState("");
  const [lastName, setLastName] =
    useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] =
    useState("");
  const [password, setPassword] =
    useState("");
  const [status, setStatus] =
    useState("ACTIVE");

  const [loading, setLoading] =
    useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) {
      return;
    }

    setError("");

    if (user) {
      setRoleId(user.roleId?._id ?? "");
      setUsername(user.username ?? "");
      setFirstName(user.firstName ?? "");
      setLastName(user.lastName ?? "");
      setEmail(user.email ?? "");
      setMobile(user.mobile ?? "");
      setPassword("");
      setStatus(user.status ?? "ACTIVE");
    } else {
      setRoleId("");
      setUsername("");
      setFirstName("");
      setLastName("");
      setEmail("");
      setMobile("");
      setPassword("");
      setStatus("ACTIVE");
    }
  }, [open, user]);

  useEffect(() => {
    if (!open) {
      return;
    }

    async function loadRoles() {
      try {
        setRolesLoading(true);
        setError("");

        const response =
          await getRoles();

        setRoles(response.data);
      } catch (error: any) {
        console.error(error);

        setError(
          error.message ??
            "Failed to load roles."
        );
      } finally {
        setRolesLoading(false);
      }
    }

    loadRoles();
  }, [open]);

  if (!open) {
    return null;
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      if (!roleId) {
        setError("Role is required.");
        return;
      }

      if (!username.trim()) {
        setError("Username is required.");
        return;
      }

      if (!firstName.trim()) {
        setError(
          "First name is required."
        );
        return;
      }

      if (!lastName.trim()) {
        setError(
          "Last name is required."
        );
        return;
      }

      if (!mobile.trim()) {
        setError(
          "Mobile number is required."
        );
        return;
      }

      if (!isEdit && !password) {
        setError(
          "Password is required."
        );
        return;
      }

      if (isEdit && user) {
        await updateUser(user._id, {
          roleId,
          username: username.trim(),
          firstName:
            firstName.trim(),
          lastName:
            lastName.trim(),
          email: email.trim(),
          mobile: mobile.trim(),
          status: status as
            | "ACTIVE"
            | "INACTIVE"
            | "BLOCKED",
        });
      } else {
        await createUser({
          roleId,
          username: username.trim(),
          firstName:
            firstName.trim(),
          lastName:
            lastName.trim(),
          email: email.trim(),
          mobile: mobile.trim(),
          password,
          status: status as
            | "ACTIVE"
            | "INACTIVE"
            | "BLOCKED",
        });
      }

      onSuccess();
    } catch (error: any) {
      console.error(error);

      setError(
        error.message ??
          "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
        <div>
          <h2 className="text-lg font-bold leading-6 text-slate-900">
            {isEdit ? "Edit User" : "Add User"}
          </h2>

          <p className="mt-1 text-sm leading-5 text-slate-500">
            {isEdit
              ? "Update user information."
              : "Create a new system user."}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onOpenChange(false)}
          disabled={loading}
          className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
        >
          <X size={20} />
        </button>
      </div>
        {/* Form */}
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

          {/* Role */}
          <div className="w-[120px]">
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
              Role
            </label>

            <select
              value={roleId}
              onChange={(event) =>
                setRoleId(event.target.value)
              }
              disabled={
                loading ||
                rolesLoading
              }
              className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-emerald-500 disabled:bg-slate-100"
            >
              <option value="">
                {rolesLoading
                  ? "Loading roles..."
                  : "Select role"}
              </option>

              {roles
                .filter(
                  (role) => role.isActive
                )
                .map((role) => (
                  <option
                    key={role._id}
                    value={role._id}
                  >
                    {role.name}
                  </option>
                ))}
            </select>
          </div>

          {/* Username */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
              Username
            </label>

            <input
              type="text"
              value={username}
              onChange={(event) =>
                setUsername(event.target.value)
              }
              placeholder="Username"
              autoComplete="username"
              disabled={loading}
              className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none transition focus:border-emerald-500"
            />
          </div>

          {/* Name */}
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                First Name
              </label>

              <input
                type="text"
                value={firstName}
                onChange={(event) =>
                  setFirstName(
                    event.target.value
                  )
                }
                placeholder="First name"
                disabled={loading}
                className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none transition focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Last Name
              </label>

              <input
                type="text"
                value={lastName}
                onChange={(event) =>
                  setLastName(
                    event.target.value
                  )
                }
                placeholder="Last name"
                disabled={loading}
                className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none transition focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Mobile + Email */}
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Mobile
              </label>

              <input
                type="text"
                value={mobile}
                onChange={(event) =>
                  setMobile(
                    event.target.value
                  )
                }
                placeholder="Mobile number"
                disabled={loading}
                className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none transition focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(
                    event.target.value
                  )
                }
                placeholder="Email address"
                disabled={loading}
                className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none transition focus:border-emerald-500"
              />
            </div>
          </div>

            {/* Password + Status */}
            <div className="flex items-end gap-5">
              {/* Password */}
              {!isEdit && (
                <div className="w-[155px]">
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Password
                  </label>

                  <input
                    type="password"
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    placeholder="Minimum 6 characters"
                    disabled={loading}
                    className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none transition focus:border-emerald-500"
                  />
                </div>
              )}

              {/* Status */}
              <div className="w-[100px]">
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Status
                </label>

                <select
                  value={status}
                  onChange={(event) =>
                    setStatus(event.target.value)
                  }
                  disabled={loading}
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-emerald-500"
                >
                  <option value="ACTIVE">
                    Active
                  </option>

                  <option value="INACTIVE">
                    Inactive
                  </option>

                  <option value="BLOCKED">
                    Blocked
                  </option>
                </select>
              </div>
            </div>
          {/* Actions */}
          <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
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
              type="submit"
              disabled={
                loading ||
                rolesLoading
              }
              className="rounded-lg bg-emerald-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : isEdit
                  ? "Update User"
                  : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}