"use client";

import Link from "next/link";

import {
  useCallback,
  useState,
} from "react";

import UserToolbar from "@/components/dashboard/users/UserToolbar";
import UserTable from "@/components/dashboard/users/UserTable";
import UserFormDialog from "@/components/dashboard/users/UserFormDialog";
import DeleteConfirmationDialog from "@/components/dashboard/users/DeleteConfirmationDialog";
import UserViewDialog from "@/components/dashboard/users/UserViewDialog";

import { User } from "@/lib/api/user";

import {
  createCSV,
  createExcel,
  createPDF,
  printPDF,
  type ExportColumn,
} from "@/lib/export/exportUtils";

/* =========================================================
   EXPORT COLUMNS
========================================================= */

const userExportColumns: ExportColumn<User>[] = [
  {
    header: "User",
    key: "fullName",
    width: 28,
  },

  {
    header: "Mobile",
    key: "mobile",
    width: 20,
  },

  {
    header: "Email",
    key: "email",
    width: 32,
  },

  {
    header: "Role",
    key: "roleId",
    width: 20,
    format: (_value, row) =>
      row.roleId?.code || "—",
  },

  {
    header: "Status",
    key: "status",
    width: 16,
  },

  {
    header: "Created",
    key: "createdAt",
    width: 20,
  },
];

/* =========================================================
   USERS PAGE
========================================================= */

export default function UsersPage() {
  const [search, setSearch] =
    useState("");

  const [refresh, setRefresh] =
    useState(0);

  const [selectedUser, setSelectedUser] =
    useState<User | null>(null);

  const [formOpen, setFormOpen] =
    useState(false);

  const [deleteOpen, setDeleteOpen] =
    useState(false);

  const [viewOpen, setViewOpen] =
    useState(false);

  /* =======================================================
     EXPORT DATA
  ======================================================= */

  const [filteredUsers, setFilteredUsers] =
    useState<User[]>([]);

  const [selectedUsers, setSelectedUsers] =
    useState<User[]>([]);

  /* =======================================================
     EXPORT STATUS
  ======================================================= */

  const [exportStatus, setExportStatus] =
    useState<{
      open: boolean;
      type: "success" | "error";
      title: string;
      message: string;
      reason?: string;
    }>({
      open: false,
      type: "success",
      title: "",
      message: "",
    });

  /* =======================================================
     RECEIVE USERS FROM TABLE
  ======================================================= */

  const handleUsersChange =
    useCallback(
      (
        users: User[],
        selected: User[]
      ) => {
        setFilteredUsers(users);
        setSelectedUsers(selected);
      },
      []
    );

  /* =======================================================
     ADD USER
  ======================================================= */

  function handleAddUser() {
    setSelectedUser(null);
    setFormOpen(true);
  }

  /* =======================================================
     EDIT USER
  ======================================================= */

  function handleEditUser(
    user: User
  ) {
    setSelectedUser(user);
    setFormOpen(true);
  }

  /* =======================================================
     VIEW USER
  ======================================================= */

  function handleViewUser(
    user: User
  ) {
    setSelectedUser(user);
    setViewOpen(true);
  }

  /* =======================================================
     DELETE USER
  ======================================================= */

  function handleDeleteUser(
    user: User
  ) {
    setSelectedUser(user);
    setDeleteOpen(true);
  }

  /* =======================================================
     SUCCESS
  ======================================================= */

  function handleSuccess() {
    setRefresh(
      (previous) =>
        previous + 1
    );

    setSelectedUser(null);

    setFormOpen(false);
    setDeleteOpen(false);
    setViewOpen(false);
  }

  /* =======================================================
     EXPORT STATUS
  ======================================================= */

  function showExportSuccess(
    fileType:
      | "CSV"
      | "Excel"
      | "PDF"
  ) {
    setExportStatus({
      open: true,
      type: "success",
      title:
        "Export Successful",
      message:
        `${fileType} exported successfully to Export Manager.`,
    });
  }

  function showExportError(
    fileType:
      | "CSV"
      | "Excel"
      | "PDF",
    error: unknown
  ) {
    const reason =
      error instanceof Error
        ? error.message
        : "An unexpected error occurred while exporting the file.";

    setExportStatus({
      open: true,
      type: "error",
      title: "Export Failed",
      message:
        `Kotoze could not export ${fileType} to Export Manager.`,
      reason,
    });
  }

  function closeExportStatus() {
    setExportStatus(
      (previous) => ({
        ...previous,
        open: false,
      })
    );
  }

  /* =======================================================
     GET EXPORT USERS

     Selected users have priority.
     If nothing is selected,
     filtered users are exported.
  ======================================================= */

  function getExportUsers(): User[] {
    if (
      selectedUsers.length > 0
    ) {
      return selectedUsers;
    }

    return filteredUsers;
  }

  /* =======================================================
     EXPORT MANAGER
  ======================================================= */

  async function handleExportToManager(
    blob: Blob,
    fileName: string,
    fileType: "csv" | "xlsx" | "pdf"
  ) {
    const formData =
      new FormData();

    formData.append(
      "file",
      blob,
      fileName
    );

    formData.append(
      "fileName",
      fileName
    );

    formData.append(
      "module",
      "users"
    );

    formData.append(
      "fileType",
      fileType
    );

    formData.append(
      "createdBy",
      "system"
    );

    const response =
      await fetch(
        "/api/exports",
        {
          method: "POST",
          body: formData,
        }
      );

    let result:
      | {
          success?: boolean;
          message?: string;
        }
      | null = null;

    try {
      result = await response.json();
    } catch {
      result = null;
    }

    if (
      !response.ok ||
      !result?.success
    ) {
      throw new Error(
        result?.message ||
          "Failed to save export to Export Manager."
      );
    }

    return result;
  }

  /* =======================================================
     PRINT
  ======================================================= */

  function handlePrint() {
    const rows =
      getExportUsers();

    if (rows.length === 0) {
      alert(
        "No users available to print."
      );

      return;
    }

    printPDF({
      title: "Users",

      subtitle:
        "System users and their access roles",

      search,

      rows,

      columns:
        userExportColumns,
    });
  }

  /* =======================================================
     EXPORT CSV
  ======================================================= */

  async function handleExportCSV() {
    try {
      const rows =
        getExportUsers();

      if (rows.length === 0) {
        alert(
          "No users available to export."
        );

        return;
      }

      const blob =
        createCSV({
          rows,

          columns:
            userExportColumns,
        });

      const fileName =
        `Kotoze-Users-${Date.now()}.csv`;

      await handleExportToManager(
        blob,
        fileName,
        "csv"
      );

      showExportSuccess("CSV");
    } catch (error) {
      showExportError(
        "CSV",
        error
      );
    }
  }

  /* =======================================================
     EXPORT EXCEL
  ======================================================= */

  async function handleExportExcel() {
    try {
      const rows =
        getExportUsers();

      if (rows.length === 0) {
        alert(
          "No users available to export."
        );

        return;
      }

      const blob =
        await createExcel({
          rows,

          columns:
            userExportColumns,

          sheetName:
            "Users",
        });

      const fileName =
        `Kotoze-Users-${Date.now()}.xlsx`;

      await handleExportToManager(
        blob,
        fileName,
        "xlsx"
      );

      showExportSuccess("Excel");
    } catch (error) {
      showExportError(
        "Excel",
        error
      );
    }
  }

  /* =======================================================
     EXPORT PDF
  ======================================================= */

  async function handleExportPDF() {
    try {
      const rows =
        getExportUsers();

      if (rows.length === 0) {
        alert(
          "No users available to export."
        );

        return;
      }

      const blob =
        createPDF({
          title: "Users",

          subtitle:
            "System users and their access roles",

          search,

          rows,

          columns:
            userExportColumns,
        });

      if (!blob) {
        return;
      }

      const fileName =
        `Kotoze-Users-${Date.now()}.pdf`;

      await handleExportToManager(
        blob,
        fileName,
        "pdf"
      );

      showExportSuccess("PDF");
    } catch (error) {
      showExportError(
        "PDF",
        error
      );
    }
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <main className="space-y-6 p-6">
      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Users
        </h1>

        <p className="mt-1 text-base text-slate-500">
          Manage system users and
          their access roles.
        </p>
      </div>

      {/* =================================================
          TOOLBAR
      ================================================= */}

      <UserToolbar
        search={search}
        onSearchChange={setSearch}
        onAddUser={
          handleAddUser
        }
        onPrint={
          handlePrint
        }
        onExportCSV={
          handleExportCSV
        }
        onExportExcel={
          handleExportExcel
        }
        onExportPDF={
          handleExportPDF
        }
      />

      {/* =================================================
          TABLE
      ================================================= */}

      <UserTable
        search={search}
        refresh={refresh}
        onEdit={
          handleEditUser
        }
        onView={
          handleViewUser
        }
        onDelete={
          handleDeleteUser
        }
        onUsersChange={
          handleUsersChange
        }
      />

      {/* =================================================
          EXPORT STATUS MODAL
      ================================================= */}

      {exportStatus.open && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            bg-black/50
            p-4
          "
          role="dialog"
          aria-modal="true"
          aria-labelledby="export-status-title"
        >
          <div
            className="
              w-full
              max-w-md
              rounded-2xl
              bg-white
              p-7
              shadow-2xl
              ring-1
              ring-slate-200
            "
          >
            <div className="flex flex-col items-center text-center">
              <div
                className={`
                  flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-full
                  ${
                    exportStatus.type ===
                    "success"
                      ? "bg-emerald-50"
                      : "bg-red-50"
                  }
                `}
              >
                {exportStatus.type ===
                "success" ? (
                  <svg
                    className="h-9 w-9 text-emerald-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                ) : (
                  <svg
                    className="h-9 w-9 text-red-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                    />
                    <path d="m9 9 6 6" />
                    <path d="m15 9-6 6" />
                  </svg>
                )}
              </div>

              <h2
                id="export-status-title"
                className="mt-5 text-xl font-semibold text-slate-900"
              >
                {exportStatus.title}
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                {exportStatus.message}
              </p>

              {exportStatus.type ===
                "error" &&
                exportStatus.reason && (
                  <div className="mt-5 w-full rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-left">
                    <div className="text-sm font-semibold text-red-800">
                      Reason
                    </div>

                    <p className="mt-1 break-words text-sm leading-5 text-red-700">
                      {
                        exportStatus.reason
                      }
                    </p>
                  </div>
                )}

              {exportStatus.type ===
              "success" ? (
                <div className="mt-6 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
                  <Link
                    href="/dashboard/exports"
                    onClick={
                      closeExportStatus
                    }
                    className="
                      inline-flex
                      items-center
                      justify-center
                      rounded-xl
                      bg-emerald-600
                      px-5
                      py-2.5
                      text-sm
                      font-semibold
                      text-white
                      transition-colors
                      hover:bg-emerald-700
                    "
                  >
                    Go to Export Manager
                  </Link>

                  <button
                    type="button"
                    onClick={
                      closeExportStatus
                    }
                    className="
                      inline-flex
                      items-center
                      justify-center
                      rounded-xl
                      border
                      border-slate-200
                      bg-white
                      px-5
                      py-2.5
                      text-sm
                      font-semibold
                      text-slate-700
                      transition-colors
                      hover:bg-slate-50
                    "
                  >
                    Close
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={
                    closeExportStatus
                  }
                  className="
                    mt-6
                    inline-flex
                    min-w-24
                    items-center
                    justify-center
                    rounded-xl
                    bg-red-600
                    px-5
                    py-2.5
                    text-sm
                    font-semibold
                    text-white
                    transition-colors
                    hover:bg-red-700
                  "
                >
                  OK
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =================================================
          ADD / EDIT USER
      ================================================= */}

      <UserFormDialog
        open={formOpen}
        onOpenChange={
          setFormOpen
        }
        user={selectedUser}
        onSuccess={
          handleSuccess
        }
      />

      {/* =================================================
          VIEW USER
      ================================================= */}

      <UserViewDialog
        open={viewOpen}
        onOpenChange={
          setViewOpen
        }
        user={selectedUser}
      />

      {/* =================================================
          DELETE USER
      ================================================= */}

      <DeleteConfirmationDialog
        open={deleteOpen}
        onOpenChange={
          setDeleteOpen
        }
        user={selectedUser}
        onSuccess={
          handleSuccess
        }
      />
    </main>
  );
}