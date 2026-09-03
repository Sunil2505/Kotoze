"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Check,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

import {
  getRoles,
  Role,
} from "@/lib/api/role";

interface RoleTableProps {
  search: string;
  refresh: number;
  onEdit: (role: Role) => void;
  onView: (role: Role) => void;
  onDelete: (role: Role) => void;

  selectedRoleIds: string[];
  onSelectionChange: (
    roleIds: string[]
  ) => void;
}

export default function RoleTable({
  search,
  refresh,
  onEdit,
  onView,
  onDelete,
  selectedRoleIds,
  onSelectionChange,
}: RoleTableProps) {
  const [roles, setRoles] =
    useState<Role[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /* =========================
     LOAD ROLES
  ========================== */

  async function loadRoles() {
    try {
      setLoading(true);
      setError("");

      const response =
        await getRoles();

      setRoles(response.data);
    } catch (error: any) {
      console.error(error);

      setError(
        error?.message ??
          "Failed to load roles."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRoles();
  }, [refresh]);

  /* =========================
     FILTERED ROLES
  ========================== */

  const filteredRoles =
    useMemo(() => {
      const value =
        search.trim().toLowerCase();

      if (!value) {
        return roles;
      }

      return roles.filter(
        (role) => {
          return (
            role.name
              .toLowerCase()
              .includes(value) ||
            role.code
              .toLowerCase()
              .includes(value) ||
            role.description
              ?.toLowerCase()
              .includes(value)
          );
        }
      );
    }, [roles, search]);

  /* =========================
     SELECTED SET
  ========================== */

  const selectedSet =
    useMemo(() => {
      return new Set(
        selectedRoleIds
      );
    }, [selectedRoleIds]);

  /* =========================
     CURRENT LIST SELECTION
  ========================== */

  const allFilteredSelected =
    filteredRoles.length > 0 &&
    filteredRoles.every(
      (role) =>
        selectedSet.has(
          role._id
        )
    );

  const someFilteredSelected =
    filteredRoles.some(
      (role) =>
        selectedSet.has(
          role._id
        )
    );

  /* =========================
     SELECT ONE ROLE
  ========================== */

  function handleToggleRole(
    roleId: string
  ) {
    const next =
      new Set(selectedRoleIds);

    if (next.has(roleId)) {
      next.delete(roleId);
    } else {
      next.add(roleId);
    }

    onSelectionChange(
      Array.from(next)
    );
  }

  /* =========================
     SELECT / DESELECT
     FILTERED ROLES
  ========================== */

  function handleToggleAll() {
    if (
      filteredRoles.length === 0
    ) {
      return;
    }

    const next =
      new Set(selectedRoleIds);

    if (allFilteredSelected) {
      filteredRoles.forEach(
        (role) => {
          next.delete(
            role._id
          );
        }
      );
    } else {
      filteredRoles.forEach(
        (role) => {
          next.add(
            role._id
          );
        }
      );
    }

    onSelectionChange(
      Array.from(next)
    );
  }

  /* =========================
     CLEAN SELECTION AFTER DATA
     ========================== */

  useEffect(() => {
    if (loading) {
      return;
    }

    const validIds =
      new Set(
        roles.map(
          (role) =>
            role._id
        )
      );

    const cleaned =
      selectedRoleIds.filter(
        (id) =>
          validIds.has(id)
      );

    if (
      cleaned.length !==
      selectedRoleIds.length
    ) {
      onSelectionChange(
        cleaned
      );
    }
  }, [
    roles,
    loading,
    selectedRoleIds,
    onSelectionChange,
  ]);

  /* =========================
     LOADING
  ========================== */

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm">
        <p className="text-sm text-slate-500">
          Loading roles...
        </p>
      </div>
    );
  }

  /* =========================
     ERROR
  ========================== */

  if (error) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-sm text-red-600">
          {error}
        </p>

        <button
          type="button"
          onClick={loadRoles}
          className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  /* =========================
     TABLE
  ========================== */

  return (
    <div className="flex h-full min-h-0 w-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

      {/* =========================
          TABLE HEADER - FIXED
      ========================== */}

      <div className="shrink-0 overflow-hidden">

        <table className="w-full table-fixed">

          <colgroup>
            <col className="w-[5%]" />
            <col className="w-[20%]" />
            <col className="w-[13%]" />
            <col className="w-[25%]" />
            <col className="w-[13%]" />
            <col className="w-[12%]" />
            <col className="w-[12%]" />
          </colgroup>

          <thead>

            <tr className="border-b border-slate-200 bg-slate-50">

              {/* SELECT ALL */}

              <th className="px-3 py-4 text-center">

                <button
                  type="button"
                  onClick={
                    handleToggleAll
                  }
                  disabled={
                    filteredRoles.length ===
                    0
                  }
                  title={
                    allFilteredSelected
                      ? "Deselect all"
                      : "Select all"
                  }
                  aria-label={
                    allFilteredSelected
                      ? "Deselect all roles"
                      : "Select all roles"
                  }
                  className="
                    mx-auto
                    flex
                    h-5
                    w-5
                    items-center
                    justify-center
                    rounded
                    border
                    border-slate-300
                    bg-white
                    transition
                    hover:border-emerald-500
                    disabled:cursor-not-allowed
                    disabled:opacity-40
                  "
                >

                  {allFilteredSelected ? (
                    <Check
                      size={14}
                      strokeWidth={2.5}
                      className="text-emerald-600"
                    />
                  ) : someFilteredSelected ? (
                    <span className="h-0.5 w-2.5 rounded-full bg-emerald-600" />
                  ) : null}

                </button>

              </th>

              <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                Role
              </th>

              <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                Code
              </th>

              <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                Description
              </th>

              <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                Type
              </th>

              <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                Status
              </th>

              <th className="px-4 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                Actions
              </th>

            </tr>

          </thead>

        </table>

      </div>

      {/* =========================
          TABLE BODY - SCROLL ONLY
      ========================== */}

      <div
        className="
          min-h-0
          flex-1
          overflow-y-auto
          overflow-x-hidden
          [scrollbar-width:none]
          [-ms-overflow-style:none]
          [&::-webkit-scrollbar]:hidden
        "
      >

        <table className="w-full table-fixed">

          <colgroup>
            <col className="w-[5%]" />
            <col className="w-[20%]" />
            <col className="w-[13%]" />
            <col className="w-[25%]" />
            <col className="w-[13%]" />
            <col className="w-[12%]" />
            <col className="w-[12%]" />
          </colgroup>

          <tbody className="divide-y divide-slate-100">

            {filteredRoles.length ===
            0 ? (
              <tr>

                <td
                  colSpan={7}
                  className="px-4 py-12 text-center"
                >

                  <p className="text-sm font-medium text-slate-600">
                    No roles found.
                  </p>

                  {search && (
                    <p className="mt-1 text-xs text-slate-400">
                      Try a different search term.
                    </p>
                  )}

                </td>

              </tr>
            ) : (
              filteredRoles.map(
                (role) => {

                  const isSelected =
                    selectedSet.has(
                      role._id
                    );

                  return (
                    <tr
                      key={
                        role._id
                      }
                      className={`
                        transition
                        ${
                          isSelected
                            ? "bg-emerald-50/50"
                            : "hover:bg-slate-50"
                        }
                      `}
                    >

                      {/* CHECKBOX */}

                      <td className="px-3 py-4 text-center">

                        <button
                          type="button"
                          onClick={() =>
                            handleToggleRole(
                              role._id
                            )
                          }
                          aria-label={
                            isSelected
                              ? `Deselect ${role.name}`
                              : `Select ${role.name}`
                          }
                          className={`
                            mx-auto
                            flex
                            h-5
                            w-5
                            items-center
                            justify-center
                            rounded
                            border
                            transition
                            ${
                              isSelected
                                ? "border-emerald-600 bg-emerald-600"
                                : "border-slate-300 bg-white hover:border-emerald-500"
                            }
                          `}
                        >

                          {isSelected && (
                            <Check
                              size={14}
                              strokeWidth={2.5}
                              className="text-white"
                            />
                          )}

                        </button>

                      </td>

                      {/* ROLE */}

                      <td className="px-4 py-4">

                        <div className="flex min-w-0 items-center gap-3">

                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-700">
                            {role.name
                              .charAt(
                                0
                              )
                              .toUpperCase()}
                          </div>

                          <div className="min-w-0">

                            <p className="truncate text-sm font-semibold text-slate-800">
                              {role.name}
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* CODE */}

                      <td className="px-4 py-4">

                        <span className="inline-block max-w-full truncate rounded-md bg-slate-100 px-2 py-1 font-mono text-xs font-semibold text-slate-700">
                          {role.code}
                        </span>

                      </td>

                      {/* DESCRIPTION */}

                      <td className="px-4 py-4">

                        <p className="truncate text-sm text-slate-600">
                          {role.description ||
                            "—"}
                        </p>

                      </td>

                      {/* TYPE */}

                      <td className="px-4 py-4">

                        {role.isSystem ? (
                          <span className="inline-flex whitespace-nowrap rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                            System
                          </span>
                        ) : (
                          <span className="inline-flex whitespace-nowrap rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                            Custom
                          </span>
                        )}

                      </td>

                      {/* STATUS */}

                      <td className="px-4 py-4">

                        <span
                          className={`
                            inline-flex
                            whitespace-nowrap
                            rounded-full
                            px-3
                            py-1
                            text-xs
                            font-semibold
                            ${
                              role.isActive
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-red-100 text-red-700"
                            }
                          `}
                        >
                          {role.isActive
                            ? "ACTIVE"
                            : "INACTIVE"}
                        </span>

                      </td>

                      {/* ACTIONS */}

                      <td className="px-4 py-4">

                        <div className="flex justify-end gap-1">

                          {/* VIEW */}

                          <button
                            type="button"
                            onClick={() =>
                              onView(
                                role
                              )
                            }
                            title="View role"
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                          >
                            <Eye
                              size={17}
                            />
                          </button>

                          {/* EDIT */}

                          <button
                            type="button"
                            onClick={() =>
                              onEdit(
                                role
                              )
                            }
                            title="Edit role"
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-emerald-50 hover:text-emerald-700"
                          >
                            <Pencil
                              size={17}
                            />
                          </button>

                          {/* DELETE */}

                          {!role.isSystem && (
                            <button
                              type="button"
                              onClick={() =>
                                onDelete(
                                  role
                                )
                              }
                              title="Delete role"
                              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2
                                size={17}
                              />
                            </button>
                          )}

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

      {/* =========================
          FOOTER - FIXED
      ========================== */}

      <div className="flex shrink-0 items-center justify-between border-t border-slate-200 px-4 py-4">

        <p className="text-sm text-slate-500">

          Showing{" "}

          <span className="font-semibold text-slate-700">
            {filteredRoles.length}
          </span>

          {" "}of{" "}

          <span className="font-semibold text-slate-700">
            {roles.length}
          </span>

          {" "}roles

        </p>

        {selectedRoleIds.length >
          0 && (
          <div
            className="
              rounded-full
              bg-emerald-50
              px-3
              py-1.5
              text-sm
              font-semibold
              text-emerald-700
            "
          >
            Selected:{" "}
            {selectedRoleIds.length}
          </div>
        )}

      </div>

    </div>
  );
}