"use client";

import { useState } from "react";

import {
  Plus,
  Search,
  Printer,
  Download,
  FileText,
  FileSpreadsheet,
  ChevronDown,
} from "lucide-react";

interface UserToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  onAddUser: () => void;

  onPrint: () => void;
  onExportCSV: () => void;
  onExportExcel: () => void;
  onExportPDF: () => void;
}

export default function UserToolbar({
  search,
  onSearchChange,
  onAddUser,
  onPrint,
  onExportCSV,
  onExportExcel,
  onExportPDF,
}: UserToolbarProps) {
  const [exportOpen, setExportOpen] =
    useState(false);

  function handleExport(
    action: () => void
  ) {
    setExportOpen(false);
    action();
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
      {/* =================================================
          SEARCH
      ================================================= */}
      <div className="relative w-full md:max-w-md">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          value={search}
          onChange={(event) =>
            onSearchChange(
              event.target.value
            )
          }
          placeholder="Search users..."
          className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:bg-white"
        />
      </div>

      {/* =================================================
          ACTIONS
      ================================================= */}
      <div className="flex flex-wrap items-center justify-end gap-2">
        {/* Print */}
        <button
          type="button"
          onClick={onPrint}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
        >
          <Printer size={17} />

          <span>Print</span>
        </button>

        {/* =================================================
            EXPORT DROPDOWN
        ================================================= */}
        <div className="relative">
          <button
            type="button"
            onClick={() =>
              setExportOpen(
                (previous) =>
                  !previous
              )
            }
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            <Download size={17} />

            <span>Export</span>

            <ChevronDown
              size={16}
              className={`transition-transform ${
                exportOpen
                  ? "rotate-180"
                  : ""
              }`}
            />
          </button>

          {exportOpen && (
            <div className="absolute right-0 z-50 mt-2 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
              {/* CSV */}
              <button
                type="button"
                onClick={() =>
                  handleExport(
                    onExportCSV
                  )
                }
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                <FileText
                  size={17}
                  className="text-slate-500"
                />

                <span>
                  Export CSV
                </span>
              </button>

              {/* Excel */}
              <button
                type="button"
                onClick={() =>
                  handleExport(
                    onExportExcel
                  )
                }
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                <FileSpreadsheet
                  size={17}
                  className="text-emerald-600"
                />

                <span>
                  Export Excel
                </span>
              </button>

              {/* PDF */}
              <button
                type="button"
                onClick={() =>
                  handleExport(
                    onExportPDF
                  )
                }
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                <FileText
                  size={17}
                  className="text-red-500"
                />

                <span>
                  Export PDF
                </span>
              </button>
            </div>
          )}
        </div>

        {/* =================================================
            ADD USER
        ================================================= */}
        <button
          type="button"
          onClick={onAddUser}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          <Plus size={18} />

          <span>Add User</span>
        </button>
      </div>
    </div>
  );
}