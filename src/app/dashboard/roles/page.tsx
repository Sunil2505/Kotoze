"use client";

import { useEffect, useState } from "react";
import {
  createCSV,
  createPDF,
  createExcel,
  printPDF,
  type ExportColumn,
} from "@/lib/export/exportUtils";

import RoleToolbar from "@/components/dashboard/roles/RoleToolbar";
import RoleTable from "@/components/dashboard/roles/RoleTable";
import RoleFormDialog from "@/components/dashboard/roles/RoleFormDialog";
import DeleteConfirmationDialog from "@/components/dashboard/roles/DeleteConfirmationDialog";

import {
  getRoles,
  Role,
} from "@/lib/api/role";

const roleExportColumns: ExportColumn<Role>[] = [
  { header: "Role", key: "name", width: 24 },
  { header: "Code", key: "code", width: 18 },
  {
    header: "Description",
    key: "description",
    width: 45,
    format: (value) => value == null || value === "" ? "" : String(value),
  },
  { header: "Type", key: "isSystem", width: 14, format: (value) => value ? "System" : "Custom" },
  { header: "Status", key: "isActive", width: 14, format: (value) => value ? "Active" : "Inactive" },
  {
    header: "Created",
    key: "createdAt",
    width: 18,
    format: (value) => value == null ? "" : new Date(String(value)).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
  },
];

type DialogMode =
  | "add"
  | "edit"
  | "view";

export default function RolesPage() {
  const [search, setSearch] =
    useState("");

  const [refresh, setRefresh] =
    useState(0);

  const [selectedRole, setSelectedRole] =
    useState<Role | null>(null);

  const [selectedRoleIds, setSelectedRoleIds] =
    useState<string[]>([]);

  const [dialogMode, setDialogMode] =
    useState<DialogMode>("add");

  const [formOpen, setFormOpen] =
    useState(false);

  const [deleteOpen, setDeleteOpen] =
    useState(false);

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

  /* =========================
     ROLE HANDLERS
  ========================== */

  function handleAddRole() {
    setSelectedRole(null);
    setDialogMode("add");
    setFormOpen(true);
  }

  function handleEditRole(
    role: Role
  ) {
    setSelectedRole(role);
    setDialogMode("edit");
    setFormOpen(true);
  }

  function handleViewRole(
    role: Role
  ) {
    setSelectedRole(role);
    setDialogMode("view");
    setFormOpen(true);
  }

  function handleDeleteRole(
    role: Role
  ) {
    if (role.isSystem) {
      return;
    }

    setSelectedRole(role);
    setDeleteOpen(true);
  }

  function handleSuccess() {
    setRefresh(
      (previous) =>
        previous + 1
    );

    setSelectedRole(null);
    setFormOpen(false);
    setDeleteOpen(false);

    /*
     * Clear selected roles after
     * add / edit / delete success.
     */
    setSelectedRoleIds([]);
  }

  /* =========================
     ROLE SELECTION
  ========================== */

  function handleSelectionChange(
    roleIds: string[]
  ) {
    setSelectedRoleIds(
      roleIds
    );
  }

  /* =========================
     EXPORT STATUS
  ========================== */

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

  useEffect(() => {
    if (!exportStatus.open) {
      return;
    }

    function handleEscape(
      event: KeyboardEvent
    ) {
      if (
        event.key ===
        "Escape"
      ) {
        closeExportStatus();
      }
    }

    window.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [
    exportStatus.open,
  ]);

  /* =========================
     GET FILTERED ROLES
  ========================== */

  async function getFilteredRoles() {
    const response =
      await getRoles();

    const roles =
      response.data;

    const keyword =
      search
        .trim()
        .toLowerCase();

    if (!keyword) {
      return roles;
    }

    return roles.filter(
      (role) => {
        return (
          role.name
            .toLowerCase()
            .includes(keyword) ||
          role.code
            .toLowerCase()
            .includes(keyword) ||
          (
            role.description ??
            ""
          )
            .toLowerCase()
            .includes(keyword)
        );
      }
    );
  }

  /* =========================
     GET EXPORT ROLES
  ========================== */

  async function getExportRoles() {
    const roles =
      await getFilteredRoles();

    if (selectedRoleIds.length === 0) {
      return roles;
    }

    return roles.filter((role) =>
      selectedRoleIds.includes(
        role._id
      )
    );
  }

  /* =========================
     SAVE EXPORT TO MANAGER
  ========================== */

  async function handleExportToManager(
    blob: Blob,
    fileName: string,
    fileType:
      | "csv"
      | "xlsx"
      | "pdf"
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
      "fileType",
      fileType
    );

    formData.append(
      "module",
      "roles"
    );

    /*
     * Authentication is not connected
     * to exports yet.
     *
     * Temporary value.
     */
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

    const result =
      await response.json();

    if (
      !response.ok ||
      !result.success
    ) {
      throw new Error(
        result.message ||
          "Failed to save export."
      );
    }

    return result.data;
  }

  /* =========================
     PRINT
  ========================== */

  async function handlePrint() {
    try {
      const roles = await getExportRoles();

      printPDF({
        title: "Roles",
        subtitle: "System and custom roles",
        search,
        rows: roles,
        columns: roleExportColumns,
      });
    } catch (error) {
      console.error("Print roles:", error);
      setExportStatus({
        open: true,
        type: "error",
        title: "Print Failed",
        message: "Kotoze could not print the Roles list.",
        reason: error instanceof Error ? error.message : "An unexpected error occurred while printing.",
      });
    }
  }

  /* =========================
     EXPORT CSV
  ========================== */

  async function handleExportCSV() {
    try {
      const roles = await getExportRoles();
      const blob = createCSV({ rows: roles, columns: roleExportColumns });
      await handleExportToManager(blob, "kotoze-roles.csv", "csv");
      showExportSuccess("CSV");
    } catch (error) {
      console.error("Export CSV:", error);
      showExportError("CSV", error);
    }
  }

  /* =========================
     EXPORT EXCEL
  ========================== */

  async function handleExportExcel() {
    try {
      const roles = await getExportRoles();
      const blob = await createExcel({
        sheetName: "Roles",
        rows: roles,
        columns: roleExportColumns,
      });
      await handleExportToManager(blob, "kotoze-roles.xlsx", "xlsx");
      showExportSuccess("Excel");
    } catch (error) {
      console.error("Export Excel:", error);
      showExportError("Excel", error);
    }
  }

  /* =========================
     EXPORT PDF
  ========================== */

  async function handleExportPDF() {
    try {
      const roles = await getExportRoles();
      const blob = createPDF({
        title: "Roles",
        subtitle: "System and custom roles",
        search,
        rows: roles,
        columns: roleExportColumns,
      });

      if (!blob) {
        throw new Error("Failed to generate PDF.");
      }

      await handleExportToManager(blob, "kotoze-roles.pdf", "pdf");
      showExportSuccess("PDF");
    } catch (error) {
      console.error("Export PDF:", error);
      showExportError("PDF", error);
    }
  }

  /* =========================
     RENDER
  ========================== */

  return (
    <main className="flex h-full min-h-0 flex-col p-6">

      {/* =========================
          PAGE HEADER
      ========================== */}

      <div className="shrink-0">

        <h1 className="text-3xl font-bold text-slate-900">
          Roles
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage system and custom roles.
        </p>

      </div>

      {/* =========================
          TOOLBAR
      ========================== */}

      <div className="mt-6 shrink-0">

        <RoleToolbar
          search={search}
          onSearchChange={
            setSearch
          }
          onAddRole={
            handleAddRole
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

      </div>

      {/* =========================
          SELECTION SUMMARY
      ========================== */}

      {selectedRoleIds.length >
        0 && (
        <div
          className="
            mt-3
            flex
            shrink-0
            items-center
            justify-between
            rounded-lg
            border
            border-emerald-100
            bg-emerald-50
            px-4
            py-2.5
          "
        >

          <p className="text-sm font-semibold text-emerald-700">

            Selected{" "}
            {selectedRoleIds.length}{" "}
            role
            {selectedRoleIds.length ===
            1
              ? ""
              : "s"}

          </p>

          <button
            type="button"
            onClick={() =>
              setSelectedRoleIds(
                []
              )
            }
            className="
              text-xs
              font-semibold
              text-emerald-700
              transition
              hover:text-emerald-900
            "
          >
            Clear selection
          </button>

        </div>
      )}

      {/* =========================
          TABLE
      ========================== */}

      <div className="mt-6 min-h-0 flex-1 overflow-hidden">

        <RoleTable
          search={search}
          refresh={refresh}
          onEdit={
            handleEditRole
          }
          onView={
            handleViewRole
          }
          onDelete={
            handleDeleteRole
          }
          selectedRoleIds={
            selectedRoleIds
          }
          onSelectionChange={
            handleSelectionChange
          }
        />

      </div>

      {/* =========================
          EXPORT STATUS MODAL
      ========================== */}

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

              <button
                type="button"
                onClick={
                  closeExportStatus
                }
                className={`
                  mt-6
                  inline-flex
                  min-w-24
                  items-center
                  justify-center
                  rounded-xl
                  px-5
                  py-2.5
                  text-sm
                  font-semibold
                  text-white
                  transition-colors
                  ${
                    exportStatus.type ===
                    "success"
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : "bg-red-600 hover:bg-red-700"
                  }
                `}
              >
                OK
              </button>

            </div>

          </div>

        </div>
      )}

      {/* =========================
          ROLE DIALOG
      ========================== */}

      <RoleFormDialog
        open={formOpen}
        onOpenChange={
          setFormOpen
        }
        role={
          selectedRole
        }
        mode={
          dialogMode
        }
        onSuccess={
          handleSuccess
        }
      />

      {/* =========================
          DELETE DIALOG
      ========================== */}

      <DeleteConfirmationDialog
        open={deleteOpen}
        onOpenChange={
          setDeleteOpen
        }
        role={
          selectedRole
        }
        onSuccess={
          handleSuccess
        }
      />

    </main>
  );
}
