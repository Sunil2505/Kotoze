"use client";

import { useEffect, useRef, useState } from "react";
import {
  Plus,
  Search,
  Printer,
  Download,
  FileText,
  FileSpreadsheet,
  FileDown,
  ChevronDown,
} from "lucide-react";

interface RoleToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  onAddRole: () => void;
  onPrint: () => void;
  onExportCSV: () => void;
  onExportExcel: () => void;
  onExportPDF: () => void;
}

export default function RoleToolbar({
  search,
  onSearchChange,
  onAddRole,
  onPrint,
  onExportCSV,
  onExportExcel,
  onExportPDF,
}: RoleToolbarProps) {
  const [exportOpen, setExportOpen] = useState(false);

  const exportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        exportRef.current &&
        !exportRef.current.contains(
          event.target as Node
        )
      ) {
        setExportOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  function handleCSV() {
    setExportOpen(false);
    onExportCSV();
  }

  function handleExcel() {
    setExportOpen(false);
    onExportExcel();
  }

  function handlePDF() {
    setExportOpen(false);
    onExportPDF();
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
      {/* =========================
          SEARCH
      ========================== */}
      <div className="relative w-full md:w-[540px]">
        <Search
          size={18}
          strokeWidth={1.8}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          value={search}
          onChange={(event) =>
            onSearchChange(event.target.value)
          }
          placeholder="Search roles..."
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

      {/* =========================
          ACTIONS
      ========================== */}
      <div className="flex shrink-0 items-center gap-2">
        {/* =========================
            EXPORT
        ========================== */}
        <div
          ref={exportRef}
          className="relative"
        >
          <button
            type="button"
            onClick={() =>
              setExportOpen(
                (previous) => !previous
              )
            }
            className="
              inline-flex
              h-10
              items-center
              justify-center
              gap-2
              rounded-lg
              border
              border-slate-200
              bg-white
              px-4
              text-sm
              font-semibold
              text-slate-600
              transition-all
              hover:border-slate-300
              hover:bg-slate-50
              hover:text-slate-900
              active:scale-[0.98]
            "
          >
            <Download
              size={17}
              strokeWidth={1.8}
            />

            <span>Export</span>

            <ChevronDown
              size={15}
              strokeWidth={1.8}
              className={`transition-transform ${
                exportOpen
                  ? "rotate-180"
                  : ""
              }`}
            />
          </button>

          {/* =========================
              EXPORT DROPDOWN
          ========================== */}
          {exportOpen && (
            <div
              className="
                absolute
                right-0
                top-full
                z-50
                mt-2
                w-48
                overflow-hidden
                rounded-xl
                border
                border-gray-900
                bg-gray-100
                p-1.5
                shadow-xl
              "
            >
              {/* Export As */}
              <div className="mb-1 rounded-md bg-white px-2.5 py-2">
                <p className="text-xs font-bold text-gray-800">
                  Export As
                </p>
              </div>

              {/* CSV */}
              <button
                type="button"
                onClick={handleCSV}
                className="
                  flex
                  w-full
                  items-center
                  gap-3
                  rounded-lg
                  px-3
                  py-2.5
                  text-left
                  text-sm
                  font-medium
                  text-gray-700
                  transition
                  hover:bg-white
                "
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-200">
                  <FileText
                    size={16}
                    strokeWidth={1.8}
                    className="text-gray-600"
                  />
                </span>

                <span>CSV File</span>
              </button>

              {/* Excel */}
              <button
                type="button"
                onClick={handleExcel}
                className="
                  flex
                  w-full
                  items-center
                  gap-3
                  rounded-lg
                  px-3
                  py-2.5
                  text-left
                  text-sm
                  font-medium
                  text-gray-700
                  transition
                  hover:bg-white
                "
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50">
                  <FileSpreadsheet
                    size={16}
                    strokeWidth={1.8}
                    className="text-emerald-600"
                  />
                </span>

                <span>Excel Workbook</span>
              </button>

              {/* PDF */}
              <button
                type="button"
                onClick={handlePDF}
                className="
                  flex
                  w-full
                  items-center
                  gap-3
                  rounded-lg
                  px-3
                  py-2.5
                  text-left
                  text-sm
                  font-medium
                  text-gray-700
                  transition
                  hover:bg-white
                "
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-50">
                  <FileDown
                    size={16}
                    strokeWidth={1.8}
                    className="text-red-500"
                  />
                </span>

                <span>PDF Document</span>
              </button>
            </div>
          )}
        </div>

        {/* =========================
            PRINT
        ========================== */}
        <button
          type="button"
          onClick={onPrint}
          title="Print roles"
          aria-label="Print roles"
          className="
            inline-flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-lg
            border
            border-slate-200
            bg-white
            text-slate-500
            transition-all
            hover:border-slate-300
            hover:bg-slate-50
            hover:text-slate-900
            active:scale-[0.98]
          "
        >
          <Printer
            size={18}
            strokeWidth={1.8}
          />
        </button>

        {/* =========================
            ADD ROLE
        ========================== */}
        <button
          type="button"
          onClick={onAddRole}
          className="
            inline-flex
            h-10
            shrink-0
            items-center
            justify-center
            gap-2
            rounded-lg
            bg-emerald-600
            px-5
            text-sm
            font-semibold
            text-white
            shadow-sm
            transition-all
            hover:bg-emerald-700
            hover:shadow
            active:scale-[0.98]
          "
        >
          <Plus
            size={18}
            strokeWidth={2}
          />

          <span>Add Role</span>
        </button>
      </div>
    </div>
  );
}