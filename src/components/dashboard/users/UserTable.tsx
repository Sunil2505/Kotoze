"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

import {
  getUsers,
  User,
} from "@/lib/api/user";

interface UserTableProps {
  search: string;
  refresh: number;
  onEdit: (user: User) => void;
  onView: (user: User) => void;
  onDelete: (user: User) => void;
}

export default function UserTable({
  search,
  refresh,
  onEdit,
  onView,
  onDelete,
}: UserTableProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadUsers() {
    try {
      setLoading(true);
      setError("");

      const response =
        await getUsers();

      setUsers(response.data);
    } catch (error: any) {
      console.error(error);

      setError(
        error.message ??
          "Failed to load users."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, [refresh]);

  const filteredUsers =
    useMemo(() => {
      const value =
        search.trim().toLowerCase();

      if (!value) {
        return users;
      }

      return users.filter((user) => {
        return (
          user.fullName
            .toLowerCase()
            .includes(value) ||
          user.mobile
            .toLowerCase()
            .includes(value) ||
          user.email
            ?.toLowerCase()
            .includes(value) ||
          user.roleId.code
            .toLowerCase()
            .includes(value)
        );
      });
    }, [users, search]);

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <p className="text-sm text-slate-500">
          Loading users...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-sm text-red-600">
          {error}
        </p>

        <button
          type="button"
          onClick={loadUsers}
          className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] table-fixed">  
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
             <th className="w-[26%] px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                User
              </th>

              <th className="w-[14%] px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                Mobile
              </th>

              <th className="w-[20%] px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                Email
              </th>

              <th className="w-[15%] px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                Role
              </th>

              <th className="w-[11%] px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                Status
              </th>

             <th className="w-[14%] px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {filteredUsers.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center"
                >
                  <p className="text-sm font-medium text-slate-600">
                    No users found.
                  </p>

                  {search && (
                    <p className="mt-1 text-xs text-slate-400">
                      Try a different search term.
                    </p>
                  )}
                </td>
              </tr>
            ) : (
              filteredUsers.map(
                (user) => (
                  <tr
                    key={user._id}
                    className="transition hover:bg-slate-50"
                  >
                    {/* User */}
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 font-semibold text-emerald-700">
                          {user.firstName
                            ?.charAt(0)
                            .toUpperCase()}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-800">
                            {user.fullName}
                          </p>

                          <p className="text-xs text-slate-400">
                            {user.firstName}{" "}
                            {user.lastName}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Mobile */}
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {user.mobile}
                    </td>

                    {/* Email */}
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {user.email || "—"}
                    </td>

                    {/* Role */}
                    <td className="px-6 py-4">
                      <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                        {user.roleId.code}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          user.status ===
                          "ACTIVE"
                            ? "bg-emerald-100 text-emerald-700"
                            : user.status ===
                                "INACTIVE"
                              ? "bg-orange-100 text-orange-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-0">
                        <button
                          type="button"
                          onClick={() =>
                            onView(user)
                          }
                          title="View user"
                          className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                        >
                          <Eye size={17} />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            onEdit(user)
                          }
                          title="Edit user"
                          className="rounded-lg p-2 text-slate-500 transition hover:bg-emerald-50 hover:text-emerald-700"
                        >
                          <Pencil
                            size={17}
                          />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            onDelete(user)
                          }
                          title="Delete user"
                          className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2
                            size={17}
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              )
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-200 px-6 py-4">
        <p className="text-sm text-slate-500">
          Showing{" "}
          <span className="font-semibold text-slate-700">
            {filteredUsers.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-slate-700">
            {users.length}
          </span>{" "}
          users
        </p>
      </div>
    </div>
  );
}