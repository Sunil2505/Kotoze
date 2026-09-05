"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Eye,
  Pencil,
  Trash2,
  Check,
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

  onUsersChange?: (
    users: User[],
    selectedUsers: User[]
  ) => void;
}

export default function UserTable({
  search,
  refresh,
  onEdit,
  onView,
  onDelete,
  onUsersChange,
}: UserTableProps) {
  const [users, setUsers] =
    useState<User[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [selectedUserIds, setSelectedUserIds] =
    useState<string[]>([]);

  /* =======================================================
     LOAD USERS
  ======================================================= */

  async function loadUsers() {
    try {
      setLoading(true);
      setError("");

      const response =
        await getUsers();

      setUsers(response.data);

      setSelectedUserIds([]);
    } catch (error: any) {
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

  /* =======================================================
     FILTER USERS
  ======================================================= */

  const filteredUsers =
    useMemo(() => {
      const value =
        search.trim().toLowerCase();

      if (!value) {
        return users;
      }

      return users.filter(
        (user) => {
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
        }
      );
    }, [users, search]);

  /* =======================================================
     SELECTED USERS
  ======================================================= */

  const selectedUsers =
    useMemo(() => {
      return users.filter(
        (user) =>
          selectedUserIds.includes(
            user._id
          )
      );
    }, [
      users,
      selectedUserIds,
    ]);

  /* =======================================================
     SEND DATA TO PARENT
  ======================================================= */

  useEffect(() => {
    onUsersChange?.(
      filteredUsers,
      selectedUsers
    );
  }, [
    filteredUsers,
    selectedUsers,
    onUsersChange,
  ]);

  /* =======================================================
     SELECT ALL STATE
  ======================================================= */

  const allFilteredSelected =
    filteredUsers.length > 0 &&
    filteredUsers.every(
      (user) =>
        selectedUserIds.includes(
          user._id
        )
    );

  /* =======================================================
     TOGGLE USER
  ======================================================= */

  function toggleUser(
    userId: string
  ) {
    setSelectedUserIds(
      (previous) =>
        previous.includes(userId)
          ? previous.filter(
              (id) =>
                id !== userId
            )
          : [
              ...previous,
              userId,
            ]
    );
  }

  /* =======================================================
     TOGGLE ALL FILTERED USERS
  ======================================================= */

  function toggleSelectAll() {
    if (allFilteredSelected) {
      setSelectedUserIds(
        (previous) =>
          previous.filter(
            (id) =>
              !filteredUsers.some(
                (user) =>
                  user._id === id
              )
          )
      );

      return;
    }

    setSelectedUserIds(
      (previous) => {
        const ids = new Set(
          previous
        );

        filteredUsers.forEach(
          (user) => {
            ids.add(user._id);
          }
        );

        return Array.from(ids);
      }
    );
  }

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <p className="text-sm text-slate-500">
          Loading users...
        </p>
      </div>
    );
  }

  /* =======================================================
     ERROR
  ======================================================= */

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

  /* =======================================================
     TABLE
  ======================================================= */

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] table-fixed">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              {/* Select */}
              <th className="w-[5%] px-4 py-4 text-center">
                <button
                  type="button"
                  onClick={
                    toggleSelectAll
                  }
                  title={
                    allFilteredSelected
                      ? "Unselect all"
                      : "Select all"
                  }
                  className={`mx-auto flex h-5 w-5 items-center justify-center rounded border transition ${
                    allFilteredSelected
                      ? "border-emerald-600 bg-emerald-600 text-white"
                      : "border-slate-300 bg-white text-transparent hover:border-emerald-500"
                  }`}
                >
                  <Check
                    size={14}
                    strokeWidth={3}
                  />
                </button>
              </th>

              {/* Serial Number */}
              <th className="w-[6%] px-4 py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-500">
                No.
              </th>

              {/* User */}
              <th className="w-[23%] px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                User
              </th>

              {/* Mobile */}
              <th className="w-[14%] px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                Mobile
              </th>

              {/* Email */}
              <th className="w-[20%] px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                Email
              </th>

              {/* Role */}
              <th className="w-[13%] px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                Role
              </th>

              {/* Status */}
              <th className="w-[10%] px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                Status
              </th>

              {/* Actions */}
              <th
                className="
                  sticky
                  right-0
                  z-20
                  w-[145px]
                  bg-slate-50
                  px-4
                  py-4
                  text-right
                  text-xs
                  font-bold
                  uppercase
                  tracking-wider
                  text-slate-500
                  shadow-[-5px_0_10px_-8px_rgba(15,23,42,0.35)]
                "
              >
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {filteredUsers.length ===
            0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-6 py-12 text-center"
                >
                  <p className="text-sm font-medium text-slate-600">
                    No users found.
                  </p>

                  {search && (
                    <p className="mt-1 text-xs text-slate-400">
                      Try a different
                      search term.
                    </p>
                  )}
                </td>
              </tr>
            ) : (
              filteredUsers.map(
                (user, index) => {
                  const selected =
                    selectedUserIds.includes(
                      user._id
                    );

                  return (
                    <tr
                      key={user._id}
                      className="transition hover:bg-slate-50"
                    >
                      {/* Select */}
                      <td className="px-4 py-4 text-center">
                        <button
                          type="button"
                          onClick={() =>
                            toggleUser(
                              user._id
                            )
                          }
                          title={
                            selected
                              ? "Unselect user"
                              : "Select user"
                          }
                          className={`mx-auto flex h-5 w-5 items-center justify-center rounded border transition ${
                            selected
                              ? "border-emerald-600 bg-emerald-600 text-white"
                              : "border-slate-300 bg-white text-transparent hover:border-emerald-500"
                          }`}
                        >
                          <Check
                            size={14}
                            strokeWidth={3}
                          />
                        </button>
                      </td>

                      {/* Serial Number */}
                      <td className="px-4 py-4 text-center text-sm font-semibold text-slate-500">
                        {index + 1}
                      </td>

                      {/* User */}
                      <td className="whitespace-nowrap px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 font-semibold text-emerald-700">
                            {user.firstName
                              ?.charAt(
                                0
                              )
                              .toUpperCase()}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-800">
                              {
                                user.fullName
                              }
                            </p>

                            <p className="text-xs text-slate-400">
                              {
                                user.firstName
                              }{" "}
                              {
                                user.lastName
                              }
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Mobile */}
                      <td className="px-5 py-4 text-sm text-slate-600">
                        {user.mobile}
                      </td>

                      {/* Email */}
                      <td className="px-5 py-4 text-sm text-slate-600">
                        {user.email ||
                          "—"}
                      </td>

                      {/* Role */}
                      <td className="px-5 py-4">
                        <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                          {
                            user.roleId
                              .code
                          }
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
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
                          {
                            user.status
                          }
                        </span>
                      </td>

                      {/* Actions */}
                      <td
                        className="
                          sticky
                          right-0
                          z-10
                          bg-white
                          px-4
                          py-4
                          shadow-[-5px_0_10px_-8px_rgba(15,23,42,0.35)]
                        "
                      >
                        <div className="flex justify-end gap-0">
                          <button
                            type="button"
                            onClick={() =>
                              onView(
                                user
                              )
                            }
                            title="View user"
                            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                          >
                            <Eye
                              size={
                                17
                              }
                            />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              onEdit(
                                user
                              )
                            }
                            title="Edit user"
                            className="rounded-lg p-2 text-slate-500 transition hover:bg-emerald-50 hover:text-emerald-700"
                          >
                            <Pencil
                              size={
                                17
                              }
                            />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              onDelete(
                                user
                              )
                            }
                            title="Delete user"
                            className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2
                              size={
                                17
                              }
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }
              )
            )}
          </tbody>
        </table>
      </div>

      {/* ===================================================
          FOOTER
      =================================================== */}

      <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4">
        <p className="text-sm text-slate-500">
          Showing{" "}
          <span className="font-semibold text-slate-700">
            {
              filteredUsers.length
            }
          </span>{" "}
          of{" "}
          <span className="font-semibold text-slate-700">
            {users.length}
          </span>{" "}
          users
        </p>

        {selectedUserIds.length >
          0 && (
          <p className="text-sm font-semibold text-emerald-600">
            {
              selectedUserIds.length
            }{" "}
            selected
          </p>
        )}
      </div>
    </div>
  );
}