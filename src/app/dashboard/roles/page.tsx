"use client";

import { useEffect, useState } from "react";
import ExcelJS from "exceljs";
import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";

import RoleToolbar from "@/components/dashboard/roles/RoleToolbar";
import RoleTable from "@/components/dashboard/roles/RoleTable";
import RoleFormDialog from "@/components/dashboard/roles/RoleFormDialog";
import DeleteConfirmationDialog from "@/components/dashboard/roles/DeleteConfirmationDialog";

import {
  getRoles,
  Role,
} from "@/lib/api/role";

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
     PRINT / PDF
  ========================== */

  function createRolesPDF(
    roles: Role[],
    autoPrint = false
  ): Blob | null {
    const doc =
      new jsPDF({
        orientation:
          "landscape",
        unit: "mm",
        format: "a4",
        compress: true,
      });

    const pageWidth =
      doc.internal.pageSize.getWidth();

    /* =========================
       TITLE
    ========================== */

    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.setFontSize(18);

    /* =========================
       BRAND TITLE
    ========================== */

    doc.setTextColor(
      47,
      125,
      90
    );

    doc.text(
      "Kotoze",
      14,
      17
    );

    const kotozeWidth =
      doc.getTextWidth(
        "Kotoze"
      );

    doc.setTextColor(
      17,
      24,
      39
    );

    doc.text(
      " - Roles",
      14 +
        kotozeWidth,
      17
    );

    /* =========================
       SUBTITLE
    ========================== */

    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.setFontSize(9);

    doc.setTextColor(
      107,
      114,
      128
    );

    doc.text(
      "System and custom roles",
      14,
      23
    );

    /* =========================
       META
    ========================== */

    const metaText =
      `Showing ${roles.length} role${
        roles.length === 1
          ? ""
          : "s"
      }${
        search.trim()
          ? `  •  Search: "${search.trim()}"`
          : ""
      }`;

    doc.setFontSize(8);

    doc.text(
      metaText,
      14,
      29
    );

    /* =========================
       TABLE DATA
    ========================== */

    const body =
      roles.map(
        (
          role,
          index
        ) => [
          String(
            index + 1
          ),

          role.name,

          role.code,

          role.description ??
            "—",

          role.isSystem
            ? "System"
            : "Custom",

          role.isActive
            ? "Active"
            : "Inactive",

          formatDate(
            role.createdAt
          ),
        ]
      );

    /* =========================
       TABLE
    ========================== */

    autoTable(doc, {
      startY: 34,

      head: [[
        "No.",
        "Role",
        "Code",
        "Description",
        "Type",
        "Status",
        "Created",
      ]],

      body,

      theme: "grid",

      tableWidth:
        pageWidth - 28,

      margin: {
        left: 14,
        right: 14,
      },

      styles: {
        font: "helvetica",

        fontSize: 8.5,

        textColor: [
          31,
          41,
          55,
        ],

        cellPadding: 2.8,

        lineColor: [
          209,
          213,
          219,
        ],

        lineWidth: 0.2,

        valign: "middle",

        overflow:
          "linebreak",

        halign: "left",
      },

      headStyles: {
        font: "helvetica",

        fontStyle:
          "bold",

        fontSize: 10,

        textColor: [
          17,
          24,
          39,
        ],

        fillColor: [
          229,
          231,
          235,
        ],

        lineColor: [
          156,
          163,
          175,
        ],

        lineWidth: 0.25,

        halign:
          "center",

        valign:
          "middle",

        cellPadding: 3.2,
      },

      columnStyles: {
        0: {
          cellWidth: 14,
          halign:
            "center",
        },

        1: {
          cellWidth: 34,
          halign: "left",
        },

        2: {
          cellWidth: 38,
          halign: "left",
        },

        3: {
          cellWidth: 75,
          halign: "left",
        },

        4: {
          cellWidth: 28,
          halign:
            "center",
        },

        5: {
          cellWidth: 28,
          halign:
            "center",
        },

        6: {
          cellWidth: 28,
          halign:
            "center",
        },
      },

      didParseCell:
        (data) => {
          if (
            data.section ===
            "body"
          ) {
            data.cell.styles.fontSize =
              8.5;
          }
        },

      didDrawPage: () => {
        const pageHeight =
          doc.internal.pageSize.getHeight();

        doc.setFont(
          "helvetica",
          "normal"
        );

        doc.setFontSize(7);

        doc.setTextColor(
          107,
          114,
          128
        );

        doc.text(
          "Printed from Kotoze Commerce Operating System",
          14,
          pageHeight - 8
        );

        doc.text(
          `Page ${doc.getNumberOfPages()}`,
          pageWidth - 14,
          pageHeight - 8,
          {
            align:
              "right",
          }
        );
      },
    });

    /* =========================
       PRINT
    ========================== */

    if (autoPrint) {
      doc.autoPrint();

      const blobUrl =
        doc.output(
          "bloburl"
        );

      window.open(
        blobUrl,
        "_blank"
      );

      return null;
    }

    return doc.output(
      "blob"
    );
  }

  /* =========================
     PRINT
  ========================== */

  async function handlePrint() {
    try {
      const roles =
        await getExportRoles();

      createRolesPDF(
        roles,
        true
      );

    } catch (error) {
      console.error(
        "Print roles:",
        error
      );

      setExportStatus({
        open: true,
        type: "error",
        title: "Print Failed",
        message:
          "Kotoze could not print the Roles list.",
        reason:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred while printing.",
      });
    }
  }

  /* =========================
     EXPORT CSV
  ========================== */

  async function handleExportCSV() {
    try {
      const roles =
        await getExportRoles();

      const headers = [
        "No.",
        "Role",
        "Code",
        "Description",
        "Type",
        "Status",
        "Created",
      ];

      const rows =
        roles.map(
          (
            role,
            index
          ) => [
            index + 1,
            role.name,
            role.code,
            role.description ??
              "",
            role.isSystem
              ? "System"
              : "Custom",
            role.isActive
              ? "Active"
              : "Inactive",
            formatDate(
              role.createdAt
            ),
          ]
        );

      const csv = [
        headers,
        ...rows,
      ]
        .map(
          (row) =>
            row
              .map(
                csvEscape
              )
              .join(",")
        )
        .join("\r\n");

      const blob =
        new Blob(
          [
            "\uFEFF" +
              csv,
          ],
          {
            type:
              "text/csv;charset=utf-8;",
          }
        );

      await handleExportToManager(
        blob,
        "kotoze-roles.csv",
        "csv"
      );

      showExportSuccess(
        "CSV"
      );

    } catch (error) {
      console.error(
        "Export CSV:",
        error
      );

      showExportError(
        "CSV",
        error
      );
    }
  }

  /* =========================
     EXPORT EXCEL
  ========================== */

  async function handleExportExcel() {
    try {
      const roles =
        await getExportRoles();

      const workbook =
        new ExcelJS.Workbook();

      workbook.creator =
        "Kotoze";

      workbook.lastModifiedBy =
        "Kotoze";

      workbook.created =
        new Date();

      workbook.modified =
        new Date();

      const worksheet =
        workbook.addWorksheet(
          "Roles"
        );

      /* =========================
         COLUMNS
      ========================== */

      worksheet.columns = [
        {
          header: "No.",
          key: "no",
          width: 8,
        },

        {
          header: "Role",
          key: "role",
          width: 24,
        },

        {
          header: "Code",
          key: "code",
          width: 18,
        },

        {
          header:
            "Description",
          key: "description",
          width: 45,
        },

        {
          header: "Type",
          key: "type",
          width: 14,
        },

        {
          header: "Status",
          key: "status",
          width: 14,
        },

        {
          header: "Created",
          key: "created",
          width: 18,
        },
      ];

      /* =========================
         DATA
      ========================== */

      roles.forEach(
        (
          role,
          index
        ) => {
          worksheet.addRow(
            {
              no:
                index + 1,

              role:
                role.name,

              code:
                role.code,

              description:
                role.description ??
                "",

              type:
                role.isSystem
                  ? "System"
                  : "Custom",

              status:
                role.isActive
                  ? "Active"
                  : "Inactive",

              created:
                formatDate(
                  role.createdAt
                ),
            }
          );
        }
      );

      /* =========================
         HEADER STYLE
      ========================== */

      const headerRow =
        worksheet.getRow(
          1
        );

      headerRow.height =
        28;

      headerRow.eachCell(
        (cell) => {
          cell.font = {
            name: "Arial",
            size: 14,
            bold: true,
          };

          cell.alignment = {
            horizontal:
              "center",
            vertical:
              "middle",
          };

          cell.fill = {
            type: "pattern",
            pattern:
              "solid",
            fgColor: {
              argb:
                "FFE5E7EB",
            },
          };

          cell.border = {
            top: {
              style: "thin",
              color: {
                argb:
                  "FF9CA3AF",
              },
            },

            bottom: {
              style: "thin",
              color: {
                argb:
                  "FF9CA3AF",
              },
            },

            left: {
              style: "thin",
              color: {
                argb:
                  "FF9CA3AF",
              },
            },

            right: {
              style: "thin",
              color: {
                argb:
                  "FF9CA3AF",
              },
            },
          };
        }
      );

      /* =========================
         DATA CELL STYLE
      ========================== */

      worksheet.eachRow(
        (
          row,
          rowNumber
        ) => {
          if (
            rowNumber ===
            1
          ) {
            return;
          }

          row.height =
            22;

          row.eachCell(
            (
              cell,
              columnNumber
            ) => {
              cell.font = {
                name: "Arial",
                size: 11,
              };

              cell.alignment = {
                vertical:
                  "middle",

                horizontal:
                  columnNumber ===
                    1 ||
                  columnNumber ===
                    5 ||
                  columnNumber ===
                    6
                    ? "center"
                    : "left",

                wrapText:
                  columnNumber ===
                  4,
              };

              cell.border = {
                top: {
                  style:
                    "thin",
                  color: {
                    argb:
                      "FFD1D5DB",
                  },
                },

                bottom: {
                  style:
                    "thin",
                  color: {
                    argb:
                      "FFD1D5DB",
                  },
                },

                left: {
                  style:
                    "thin",
                  color: {
                    argb:
                      "FFD1D5DB",
                  },
                },

                right: {
                  style:
                    "thin",
                  color: {
                    argb:
                      "FFD1D5DB",
                  },
                },
              };
            }
          );
        }
      );

      /* =========================
         AUTOMATIC COLUMN WIDTH
      ========================== */

      const minimumWidths =
        [
          6,
          18,
          14,
          20,
          12,
          12,
          15,
        ];

      const maximumWidths =
        [
          8,
          35,
          25,
          60,
          16,
          16,
          20,
        ];

      worksheet.columns.forEach(
        (
          column,
          index
        ) => {
          let maxLength =
            minimumWidths[
              index
            ];

          column.eachCell?.(
            {
              includeEmpty:
                false,
            },
            (cell) => {
              const value =
                cell.value;

              if (
                value ===
                  null ||
                value ===
                  undefined
              ) {
                return;
              }

              const length =
                String(
                  value
                ).length;

              if (
                length >
                maxLength
              ) {
                maxLength =
                  length;
              }
            }
          );

          column.width =
            Math.min(
              maxLength +
                3,
              maximumWidths[
                index
              ]
            );
        }
      );

      /* =========================
         FREEZE HEADER
      ========================== */

      worksheet.views =
        [
          {
            state:
              "frozen",
            ySplit: 1,
          },
        ];

      /* =========================
         PAGE SETUP
      ========================== */

      worksheet.pageSetup =
        {
          orientation:
            "landscape",

          fitToPage: true,

          fitToWidth: 1,

          fitToHeight: 0,
        };

      /* =========================
         FOOTER
      ========================== */

      worksheet.headerFooter
        .oddFooter =
        "&LGenerated by Kotoze&CPage &P of &N";

      /* =========================
         CREATE EXCEL BLOB
      ========================== */

      const buffer =
        await workbook.xlsx.writeBuffer();

      const blob =
        new Blob(
          [buffer],
          {
            type:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          }
        );

      /* =========================
         SAVE TO EXPORT MANAGER
      ========================== */

      await handleExportToManager(
        blob,
        "kotoze-roles.xlsx",
        "xlsx"
      );

      showExportSuccess(
        "Excel"
      );

    } catch (error) {
      console.error(
        "Export Excel:",
        error
      );

      showExportError(
        "Excel",
        error
      );
    }
  }

  /* =========================
     EXPORT PDF
  ========================== */

  async function handleExportPDF() {
    try {
      const roles =
        await getExportRoles();

      const blob =
        createRolesPDF(
          roles,
          false
        );

      if (!blob) {
        throw new Error(
          "Failed to generate PDF."
        );
      }

      await handleExportToManager(
        blob,
        "kotoze-roles.pdf",
        "pdf"
      );

      showExportSuccess(
        "PDF"
      );

    } catch (error) {
      console.error(
        "Export PDF:",
        error
      );

      showExportError(
        "PDF",
        error
      );
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

/* =========================
   HELPERS
========================= */

function formatDate(
  value: string
): string {
  return new Date(
    value
  ).toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}

function csvEscape(
  value:
    | string
    | number
): string {
  return `"${String(
    value
  )
    .replace(
      /"/g,
      '""'
    )
    .replace(
      /\r?\n/g,
      " "
    )}"`;
}