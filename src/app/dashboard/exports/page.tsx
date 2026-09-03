"use client";

import {
  Download,
  FileDown,
  FileSpreadsheet,
  FileText,
  FolderDown,
  Search,
  Trash2,
  X,
  Check,
  AlertCircle,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

interface ExportRecord {
  _id: string;
  fileName: string;
  fileType: "csv" | "xlsx" | "pdf";
  module: string;
  storageKey: string;
  fileSize: number;
  createdBy: string;
  status: "processing" | "completed" | "failed";
  createdAt: string;
}

const moduleOptions = [
  "All Modules",
  "roles",
  "users",
  "vendors",
  "categories",
  "brands",
  "products",
  "inventory",
  "orders",
];

const typeOptions = [
  "All Types",
  "pdf",
  "xlsx",
  "csv",
];

/* =========================
   HELPERS
========================= */

function formatModule(module: string) {
  if (!module) {
    return "-";
  }

  return module
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}

function formatFileSize(bytes: number) {
  if (!bytes || bytes <= 0) {
    return "0 KB";
  }

  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(
    bytes /
    (1024 * 1024)
  ).toFixed(1)} MB`;
}

function formatDate(date: string) {
  if (!date) {
    return "-";
  }

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  ).format(new Date(date));
}

function getFileIcon(
  fileType: ExportRecord["fileType"]
) {
  if (fileType === "pdf") {
    return FileDown;
  }

  if (fileType === "xlsx") {
    return FileSpreadsheet;
  }

  return FileText;
}

function getFileIconClass(
  fileType: ExportRecord["fileType"]
) {
  if (fileType === "pdf") {
    return "bg-red-50 text-red-500";
  }

  if (fileType === "xlsx") {
    return "bg-emerald-50 text-emerald-600";
  }

  return "bg-slate-100 text-slate-500";
}

function getTypeLabel(
  fileType: ExportRecord["fileType"]
) {
  if (fileType === "xlsx") {
    return "Excel";
  }

  if (fileType === "pdf") {
    return "PDF";
  }

  return "CSV";
}

/* =========================
   MODAL TYPES
========================= */

type DeleteModalState = {
  open: boolean;
  item: ExportRecord | null;
};

type MessageModalState = {
  open: boolean;
  type: "success" | "error";
  title: string;
  message: string;
};

/* =========================
   DELETE CONFIRMATION MODAL
========================= */

function DeleteConfirmationModal({
  open,
  item,
  deleting,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  item: ExportRecord | null;
  deleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  if (!open || !item) {
    return null;
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-[100]
        flex
        items-center
        justify-center
        bg-slate-950/45
        px-4
        backdrop-blur-[2px]
      "
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-export-title"
    >
      <div
        className="
          w-full
          max-w-[500px]
          overflow-hidden
          rounded-2xl
          border
          border-slate-200
          bg-white
          shadow-2xl
        "
      >
        {/* Header / Icon */}

        <div className="flex flex-col items-center px-8 pt-8 text-center">

          <div
            className="
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-full
              bg-red-50
              text-red-600
            "
          >
            <Trash2
              size={28}
              strokeWidth={1.8}
            />
          </div>

          <h2
            id="delete-export-title"
            className="
              mt-5
              text-xl
              font-bold
              text-slate-900
            "
          >
            Delete Export
          </h2>

          <p
            className="
              mt-2
              text-sm
              leading-6
              text-slate-500
            "
          >
            Are you sure you want to delete this
            exported file?
          </p>

        </div>

        {/* File Information */}

        <div
          className="
            mx-8
            mt-6
            rounded-xl
            border
            border-slate-200
            bg-slate-50
            px-4
            py-3
          "
        >
          <p
            className="
              truncate
              text-sm
              font-semibold
              text-slate-800
            "
          >
            {item.fileName}
          </p>

          <p
            className="
              mt-1
              text-xs
              text-slate-500
            "
          >
            {formatModule(item.module)}
            {" • "}
            {getTypeLabel(item.fileType)}
            {" • "}
            {formatFileSize(item.fileSize)}
          </p>
        </div>

        {/* Warning */}

        <div
          className="
            mx-8
            mt-4
            rounded-xl
            border
            border-red-100
            bg-red-50
            px-4
            py-3
          "
        >
          <p
            className="
              text-xs
              leading-5
              text-red-700
            "
          >
            This will permanently remove the exported
            file from Export Manager.
          </p>
        </div>

        {/* Actions */}

        <div
          className="
            flex
            items-center
            justify-end
            gap-3
            px-8
            py-7
          "
        >
          <button
            type="button"
            onClick={onCancel}
            disabled={deleting}
            className="
              h-10
              rounded-lg
              border
              border-slate-200
              bg-white
              px-5
              text-sm
              font-semibold
              text-slate-600
              transition
              hover:bg-slate-50
              hover:text-slate-800
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="
              inline-flex
              h-10
              min-w-[100px]
              items-center
              justify-center
              gap-2
              rounded-lg
              bg-red-600
              px-5
              text-sm
              font-semibold
              text-white
              transition
              hover:bg-red-700
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            {deleting ? (
              <>
                <div
                  className="
                    h-4
                    w-4
                    animate-spin
                    rounded-full
                    border-2
                    border-red-200
                    border-t-white
                  "
                />

                Deleting...
              </>
            ) : (
              <>
                <Trash2
                  size={16}
                  strokeWidth={1.8}
                />

                Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================
   MESSAGE MODAL
========================= */

function MessageModal({
  open,
  type,
  title,
  message,
  onClose,
}: MessageModalState & {
  onClose: () => void;
}) {
  if (!open) {
    return null;
  }

  const isSuccess =
    type === "success";

  return (
    <div
      className="
        fixed
        inset-0
        z-[110]
        flex
        items-center
        justify-center
        bg-slate-950/45
        px-4
        backdrop-blur-[2px]
      "
      role="dialog"
      aria-modal="true"
      aria-labelledby="message-modal-title"
    >
      <div
        className="
          w-full
          max-w-[500px]
          rounded-2xl
          border
          border-slate-200
          bg-white
          px-8
          py-8
          shadow-2xl
        "
      >
        {/* Icon */}

        <div className="flex justify-center">

          <div
            className={
              isSuccess
                ? `
                  flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-full
                  bg-emerald-50
                  text-emerald-600
                `
                : `
                  flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-full
                  bg-red-50
                  text-red-600
                `
            }
          >
            {isSuccess ? (
              <Check
                size={32}
                strokeWidth={2}
              />
            ) : (
              <AlertCircle
                size={32}
                strokeWidth={1.9}
              />
            )}
          </div>

        </div>

        {/* Title */}

        <h2
          id="message-modal-title"
          className="
            mt-5
            text-center
            text-xl
            font-bold
            text-slate-900
          "
        >
          {title}
        </h2>

        {/* Message */}

        <p
          className="
            mt-3
            text-center
            text-sm
            leading-6
            text-slate-500
          "
        >
          {message}
        </p>

        {/* Button */}

        <div className="mt-7 flex justify-center">

          <button
            type="button"
            onClick={onClose}
            className={
              isSuccess
                ? `
                  h-10
                  min-w-[116px]
                  rounded-lg
                  bg-emerald-600
                  px-5
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:bg-emerald-700
                `
                : `
                  h-10
                  min-w-[116px]
                  rounded-lg
                  bg-red-600
                  px-5
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:bg-red-700
                `
            }
          >
            OK
          </button>

        </div>
      </div>
    </div>
  );
}

/* =========================
   PAGE
========================= */

export default function ExportManagerPage() {
  const [exports, setExports] =
    useState<ExportRecord[]>([]);

  const [search, setSearch] =
    useState("");

  const [moduleFilter, setModuleFilter] =
    useState("All Modules");

  const [typeFilter, setTypeFilter] =
    useState("All Types");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  /* =========================
     DELETE MODAL
  ========================== */

  const [deleteModal, setDeleteModal] =
    useState<DeleteModalState>({
      open: false,
      item: null,
    });

  /* =========================
     MESSAGE MODAL
  ========================== */

  const [messageModal, setMessageModal] =
    useState<MessageModalState>({
      open: false,
      type: "success",
      title: "",
      message: "",
    });

  /* =========================
     FETCH EXPORTS
  ========================== */

  const fetchExports =
    useCallback(async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await fetch(
            "/api/exports",
            {
              method: "GET",
              cache: "no-store",
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
              "Failed to load exports."
          );
        }

        setExports(
          result.data || []
        );

      } catch (fetchError) {
        console.error(
          "Export Manager:",
          fetchError
        );

        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "Failed to load exports."
        );

      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    fetchExports();
  }, [fetchExports]);

  /* =========================
     FILTER
  ========================== */

  const filteredExports =
    useMemo(() => {
      const searchValue =
        search
          .trim()
          .toLowerCase();

      return exports.filter(
        (item) => {
          const matchesSearch =
            !searchValue ||
            item.fileName
              .toLowerCase()
              .includes(searchValue) ||
            item.module
              .toLowerCase()
              .includes(searchValue);

          const matchesModule =
            moduleFilter ===
              "All Modules" ||
            item.module.toLowerCase() ===
              moduleFilter.toLowerCase();

          const matchesType =
            typeFilter ===
              "All Types" ||
            item.fileType ===
              typeFilter;

          return (
            matchesSearch &&
            matchesModule &&
            matchesType
          );
        }
      );
    }, [
      exports,
      search,
      moduleFilter,
      typeFilter,
    ]);

  /* =========================
     DOWNLOAD
  ========================== */

  async function handleDownload(
    exportItem: ExportRecord
  ) {
    try {
      const response =
        await fetch(
          `/api/exports/${exportItem._id}/download`
        );

      if (!response.ok) {
        const result =
          await response
            .json()
            .catch(() => null);

        throw new Error(
          result?.message ||
            "Failed to download file."
        );
      }

      const blob =
        await response.blob();

      const url =
        URL.createObjectURL(
          blob
        );

      const anchor =
        document.createElement(
          "a"
        );

      anchor.href = url;

      anchor.download =
        exportItem.fileName;

      document.body.appendChild(
        anchor
      );

      anchor.click();

      anchor.remove();

      URL.revokeObjectURL(
        url
      );

    } catch (downloadError) {
      console.error(
        "Export download:",
        downloadError
      );

      setMessageModal({
        open: true,
        type: "error",
        title: "Download Failed",
        message:
          downloadError instanceof Error
            ? downloadError.message
            : "Failed to download file.",
      });
    }
  }

  /* =========================
     OPEN DELETE MODAL
  ========================== */

  function handleDelete(
    exportItem: ExportRecord
  ) {
    if (deletingId) {
      return;
    }

    setDeleteModal({
      open: true,
      item: exportItem,
    });
  }

  /* =========================
     CANCEL DELETE
  ========================== */

  function handleCancelDelete() {
    if (deletingId) {
      return;
    }

    setDeleteModal({
      open: false,
      item: null,
    });
  }

  /* =========================
     CONFIRM DELETE
  ========================== */

  async function handleConfirmDelete() {
    const exportItem =
      deleteModal.item;

    if (!exportItem) {
      return;
    }

    try {
      setDeletingId(
        exportItem._id
      );

      const response =
        await fetch(
          `/api/exports/${exportItem._id}`,
          {
            method: "DELETE",
          }
        );

      const result =
        await response
          .json()
          .catch(() => null);

      if (
        !response.ok ||
        !result?.success
      ) {
        throw new Error(
          result?.message ||
            "Failed to delete export."
        );
      }

      /* =========================
         REMOVE FROM TABLE
      ========================== */

      setExports(
        (previous) =>
          previous.filter(
            (item) =>
              item._id !==
              exportItem._id
          )
      );

      /* =========================
         CLOSE DELETE MODAL
      ========================== */

      setDeleteModal({
        open: false,
        item: null,
      });

      /* =========================
         SUCCESS MESSAGE
      ========================== */

      setMessageModal({
        open: true,
        type: "success",
        title: "Export Deleted",
        message:
          `"${exportItem.fileName}" was deleted successfully from Export Manager.`,
      });

    } catch (deleteError) {
      console.error(
        "Export delete:",
        deleteError
      );

      /* =========================
         CLOSE DELETE MODAL
      ========================== */

      setDeleteModal({
        open: false,
        item: null,
      });

      /* =========================
         FAILURE MESSAGE
      ========================== */

      setMessageModal({
        open: true,
        type: "error",
        title: "Delete Failed",
        message:
          deleteError instanceof Error
            ? deleteError.message
            : "Failed to delete export.",
      });

    } finally {
      setDeletingId(null);
    }
  }

  /* =========================
     CLOSE MESSAGE
  ========================== */

  function handleCloseMessage() {
    setMessageModal(
      (previous) => ({
        ...previous,
        open: false,
      })
    );
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

        <div className="flex items-center gap-3">

          <div
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-xl
              bg-emerald-50
              text-emerald-700
            "
          >
            <FolderDown
              size={22}
              strokeWidth={1.8}
            />
          </div>

          <div>

            <h1
              className="
                text-3xl
                font-bold
                text-slate-900
              "
            >
              Export Manager
            </h1>

            <p
              className="
                mt-1
                text-sm
                text-slate-500
              "
            >
              Manage and download your generated files.
            </p>

          </div>

        </div>

      </div>

      {/* =========================
          TOOLBAR
      ========================== */}

      <div
        className="
          mt-6
          shrink-0
          rounded-xl
          border
          border-slate-200
          bg-white
          p-4
          shadow-sm
        "
      >

        <div
          className="
            flex
            flex-col
            gap-3
            lg:flex-row
            lg:items-center
            lg:justify-between
          "
        >

          {/* Search */}

          <div
            className="
              relative
              w-full
              lg:w-[520px]
            "
          >

            <Search
              size={18}
              strokeWidth={1.8}
              className="
                absolute
                left-3.5
                top-1/2
                -translate-y-1/2
                text-slate-400
              "
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search exported files..."
              className="
                h-10
                w-full
                rounded-lg
                border
                border-slate-200
                bg-slate-50
                pl-10
                pr-4
                text-sm
                text-slate-700
                outline-none
                transition-all
                placeholder:text-slate-400
                hover:border-slate-300
                focus:border-emerald-500
                focus:bg-white
                focus:ring-2
                focus:ring-emerald-100
              "
            />

          </div>

          {/* Filters */}

          <div
            className="
              flex
              flex-wrap
              items-center
              gap-2
            "
          >

            <select
              value={moduleFilter}
              onChange={(event) =>
                setModuleFilter(
                  event.target.value
                )
              }
              className="
                h-10
                rounded-lg
                border
                border-slate-200
                bg-white
                px-3
                text-sm
                font-medium
                text-slate-600
                outline-none
                transition
                hover:border-slate-300
                focus:border-emerald-500
                focus:ring-2
                focus:ring-emerald-100
              "
            >
              {moduleOptions.map(
                (module) => (
                  <option
                    key={module}
                    value={module}
                  >
                    {module ===
                    "All Modules"
                      ? module
                      : formatModule(
                          module
                        )}
                  </option>
                )
              )}
            </select>

            <select
              value={typeFilter}
              onChange={(event) =>
                setTypeFilter(
                  event.target.value
                )
              }
              className="
                h-10
                rounded-lg
                border
                border-slate-200
                bg-white
                px-3
                text-sm
                font-medium
                text-slate-600
                outline-none
                transition
                hover:border-slate-300
                focus:border-emerald-500
                focus:ring-2
                focus:ring-emerald-100
              "
            >
              {typeOptions.map(
                (type) => (
                  <option
                    key={type}
                    value={type}
                  >
                    {type ===
                    "All Types"
                      ? type
                      : getTypeLabel(
                          type as ExportRecord["fileType"]
                        )}
                  </option>
                )
              )}
            </select>

          </div>

        </div>

      </div>

      {/* =========================
          TABLE
      ========================== */}

      <div
        className="
          mt-6
          min-h-0
          flex-1
          overflow-hidden
          rounded-xl
          border
          border-slate-200
          bg-white
          shadow-sm
        "
      >

        {loading ? (

          <div
            className="
              flex
              h-full
              min-h-[300px]
              items-center
              justify-center
            "
          >

            <div
              className="
                flex
                items-center
                gap-3
                text-sm
                text-slate-500
              "
            >

              <div
                className="
                  h-5
                  w-5
                  animate-spin
                  rounded-full
                  border-2
                  border-slate-200
                  border-t-emerald-600
                "
              />

              Loading exports...

            </div>

          </div>

        ) : error ? (

          <div
            className="
              flex
              h-full
              min-h-[300px]
              items-center
              justify-center
              px-6
            "
          >

            <div className="text-center">

              <p
                className="
                  text-sm
                  font-semibold
                  text-red-600
                "
              >
                Failed to load exports.
              </p>

              <p
                className="
                  mt-1
                  text-sm
                  text-slate-500
                "
              >
                {error}
              </p>

              <button
                type="button"
                onClick={fetchExports}
                className="
                  mt-4
                  rounded-lg
                  bg-emerald-600
                  px-4
                  py-2
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:bg-emerald-700
                "
              >
                Try Again
              </button>

            </div>

          </div>

        ) : filteredExports.length ===
          0 ? (

          <div
            className="
              flex
              h-full
              min-h-[300px]
              items-center
              justify-center
              px-6
            "
          >

            <div className="text-center">

              <div
                className="
                  mx-auto
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-2xl
                  bg-slate-100
                  text-slate-400
                "
              >
                <FolderDown
                  size={26}
                  strokeWidth={1.7}
                />
              </div>

              <h2
                className="
                  mt-4
                  text-base
                  font-semibold
                  text-slate-800
                "
              >
                {exports.length === 0
                  ? "No exports yet"
                  : "No matching exports"}
              </h2>

              <p
                className="
                  mt-1
                  max-w-sm
                  text-sm
                  text-slate-500
                "
              >
                {exports.length === 0
                  ? "Your generated files will appear here."
                  : "Try changing your search or filters."}
              </p>

            </div>

          </div>

        ) : (

          <div className="h-full overflow-auto">

            <table
              className="
                w-full
                min-w-[1080px]
                border-collapse
              "
            >

              <thead
                className="
                  sticky
                  top-0
                  z-10
                  bg-slate-50
                "
              >

                <tr
                  className="
                    border-b
                    border-slate-200
                  "
                >

                  <th
                    className="
                      px-5
                      py-3.5
                      text-left
                      text-xs
                      font-bold
                      uppercase
                      tracking-wide
                      text-slate-500
                    "
                  >
                    File Name
                  </th>

                  <th
                    className="
                      px-5
                      py-3.5
                      text-left
                      text-xs
                      font-bold
                      uppercase
                      tracking-wide
                      text-slate-500
                    "
                  >
                    Module
                  </th>

                  <th
                    className="
                      px-5
                      py-3.5
                      text-left
                      text-xs
                      font-bold
                      uppercase
                      tracking-wide
                      text-slate-500
                    "
                  >
                    Format
                  </th>

                  <th
                    className="
                      px-5
                      py-3.5
                      text-left
                      text-xs
                      font-bold
                      uppercase
                      tracking-wide
                      text-slate-500
                    "
                  >
                    Size
                  </th>

                  <th
                    className="
                      px-5
                      py-3.5
                      text-left
                      text-xs
                      font-bold
                      uppercase
                      tracking-wide
                      text-slate-500
                    "
                  >
                    Created
                  </th>

                  <th
                    className="
                      px-5
                      py-3.5
                      text-left
                      text-xs
                      font-bold
                      uppercase
                      tracking-wide
                      text-slate-500
                    "
                  >
                    Status
                  </th>

                  <th
                    className="
                      sticky
                      right-0
                      z-20
                      w-[100px]
                      bg-slate-50
                      px-5
                      py-3.5
                      text-right
                      text-xs
                      font-bold
                      uppercase
                      tracking-wide
                      text-slate-500
                      shadow-[-4px_0_8px_-6px_rgba(0,0,0,0.25)]
                    "
                  >
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredExports.map(
                  (item) => {

                    const Icon =
                      getFileIcon(
                        item.fileType
                      );

                    return (
                      <tr
                        key={
                          item._id
                        }
                        className="
                          border-b
                          border-slate-100
                          last:border-0
                          hover:bg-slate-50/70
                        "
                      >

                        {/* File */}

                        <td className="px-5 py-4">

                          <div
                            className="
                              flex
                              min-w-0
                              items-center
                              gap-3
                            "
                          >

                            <div
                              className={`
                                flex
                                h-10
                                w-10
                                shrink-0
                                items-center
                                justify-center
                                rounded-lg
                                ${getFileIconClass(
                                  item.fileType
                                )}
                              `}
                            >

                              <Icon
                                size={18}
                                strokeWidth={
                                  1.8
                                }
                              />

                            </div>

                            <div
                              className="
                                min-w-0
                              "
                            >

                              <p
                                className="
                                  truncate
                                  text-sm
                                  font-semibold
                                  text-slate-800
                                "
                              >
                                {
                                  item.fileName
                                }
                              </p>

                              <p
                                className="
                                  mt-0.5
                                  text-xs
                                  text-slate-400
                                "
                              >
                                Export file
                              </p>

                            </div>

                          </div>

                        </td>

                        {/* Module */}

                        <td
                          className="
                            px-5
                            py-4
                            text-sm
                            font-medium
                            text-slate-600
                          "
                        >
                          {formatModule(
                            item.module
                          )}
                        </td>

                        {/* Format */}

                        <td className="px-5 py-4">

                          <span
                            className="
                              inline-flex
                              rounded-md
                              bg-slate-100
                              px-2.5
                              py-1
                              text-xs
                              font-semibold
                              text-slate-600
                            "
                          >
                            {getTypeLabel(
                              item.fileType
                            )}
                          </span>

                        </td>

                        {/* Size */}

                        <td
                          className="
                            px-5
                            py-4
                            text-sm
                            text-slate-500
                          "
                        >
                          {formatFileSize(
                            item.fileSize
                          )}
                        </td>

                        {/* Created */}

                        <td
                          className="
                            px-5
                            py-4
                            text-sm
                            text-slate-500
                          "
                        >
                          {formatDate(
                            item.createdAt
                          )}
                        </td>

                        {/* Status */}

                        <td className="px-5 py-4">

                          <span
                            className={`
                              inline-flex
                              rounded-full
                              px-2.5
                              py-1
                              text-xs
                              font-semibold
                              ${
                                item.status ===
                                "completed"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : item.status ===
                                    "failed"
                                  ? "bg-red-50 text-red-600"
                                  : "bg-amber-50 text-amber-700"
                              }
                            `}
                          >
                            {item.status
                              .charAt(0)
                              .toUpperCase() +
                              item.status.slice(
                                1
                              )}
                          </span>

                        </td>

                        {/* Actions */}

                        <td
                          className="
                            sticky
                            right-0
                            z-10
                            w-[100px]
                            bg-white
                            px-5
                            py-4
                            shadow-[-4px_0_8px_-6px_rgba(0,0,0,0.18)]
                          "
                        >

                          <div
                            className="
                              flex
                              items-center
                              justify-end
                              gap-1
                            "
                          >

                            {/* Download */}

                            <button
                              type="button"
                              title="Download"
                              aria-label={`Download ${item.fileName}`}
                              onClick={() =>
                                handleDownload(
                                  item
                                )
                              }
                              className="
                                flex
                                h-9
                                w-9
                                items-center
                                justify-center
                                rounded-lg
                                text-slate-500
                                transition
                                hover:bg-emerald-50
                                hover:text-emerald-700
                              "
                            >
                              <Download
                                size={17}
                                strokeWidth={
                                  1.8
                                }
                              />
                            </button>

                            {/* Delete */}

                            <button
                              type="button"
                              title="Delete"
                              aria-label={`Delete ${item.fileName}`}
                              disabled={
                                deletingId ===
                                item._id
                              }
                              onClick={() =>
                                handleDelete(
                                  item
                                )
                              }
                              className="
                                flex
                                h-9
                                w-9
                                items-center
                                justify-center
                                rounded-lg
                                text-slate-400
                                transition
                                hover:bg-red-50
                                hover:text-red-600
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                              "
                            >

                              {deletingId ===
                              item._id ? (
                                <div
                                  className="
                                    h-4
                                    w-4
                                    animate-spin
                                    rounded-full
                                    border-2
                                    border-slate-200
                                    border-t-red-500
                                  "
                                />
                              ) : (
                                <Trash2
                                  size={17}
                                  strokeWidth={
                                    1.8
                                  }
                                />
                              )}

                            </button>

                          </div>

                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

      {/* =========================
          DELETE CONFIRMATION MODAL
      ========================== */}

      <DeleteConfirmationModal
        open={
          deleteModal.open
        }
        item={
          deleteModal.item
        }
        deleting={
          deletingId !== null
        }
        onCancel={
          handleCancelDelete
        }
        onConfirm={
          handleConfirmDelete
        }
      />

      {/* =========================
          MESSAGE MODAL
      ========================== */}

      <MessageModal
        open={
          messageModal.open
        }
        type={
          messageModal.type
        }
        title={
          messageModal.title
        }
        message={
          messageModal.message
        }
        onClose={
          handleCloseMessage
        }
      />

    </main>
  );
}