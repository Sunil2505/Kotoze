import ExcelJS from "exceljs";
import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";

/* =========================================================
   TYPES
========================================================= */

export type ExportValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | Date;

export interface ExportColumn<T> {
  header: string;
  key: keyof T | string;
  width?: number;
  format?: (
    value: ExportValue,
    row: T
  ) => string | number;
}

export interface PdfExportOptions<T> {
  title: string;
  subtitle?: string;
  search?: string;
  rows: T[];
  columns: ExportColumn<T>[];
  fileName?: string;
  autoPrint?: boolean;
}

export interface ExcelExportOptions<T> {
  sheetName: string;
  rows: T[];
  columns: ExportColumn<T>[];
  fileName: string;
}

export interface CsvExportOptions<T> {
  rows: T[];
  columns: ExportColumn<T>[];
  fileName: string;
}

/* =========================================================
   DATE
========================================================= */

export function formatExportDate(
  value: ExportValue
): string {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "—";
  }

  const date =
    value instanceof Date
      ? value
      : new Date(String(value));

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString(
    undefined,
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}

/* =========================================================
   VALUE
========================================================= */

function getColumnValue<T>(
  row: T,
  column: ExportColumn<T>
): string | number {
  const value =
    (row as Record<string, ExportValue>)[
      String(column.key)
    ];

  if (column.format) {
    return column.format(
      value,
      row
    );
  }

  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  if (value instanceof Date) {
    return formatExportDate(value);
  }

  return typeof value === "boolean"
    ? value
      ? "Yes"
      : "No"
    : String(value);
}

/* =========================================================
   CSV ESCAPE
========================================================= */

export function csvEscape(
  value: ExportValue
): string {
  const stringValue =
    value === null ||
    value === undefined
      ? ""
      : String(value);

  return `"${stringValue.replace(
    /"/g,
    '""'
  )}"`;
}

/* =========================================================
   CREATE CSV
========================================================= */

export function createCSV<T>({
  rows,
  columns,
}: Omit<CsvExportOptions<T>, "fileName">): Blob {
  const headers = ["No.", ...columns.map((column) => column.header)];

  const dataRows = rows.map((row, index) => [
    index + 1,
    ...columns.map((column) => getColumnValue(row, column)),
  ]);

  const csv = [headers, ...dataRows]
    .map((row) => row.map((value) => csvEscape(value)).join(","))
    .join("\r\n");

  return new Blob(["\uFEFF", csv], {
    type: "text/csv;charset=utf-8;",
  });
}

/* =========================================================
   DOWNLOAD BLOB
========================================================= */

export function downloadBlob(
  blob: Blob,
  fileName: string
): void {
  const url =
    URL.createObjectURL(blob);

  const anchor =
    document.createElement("a");

  anchor.href = url;
  anchor.download = fileName;

  document.body.appendChild(anchor);

  anchor.click();

  anchor.remove();

  URL.revokeObjectURL(url);
}

/* =========================================================
   EXPORT CSV
========================================================= */

export function exportCSV<T>({
  rows,
  columns,
  fileName,
}: CsvExportOptions<T>): Blob {
  const blob =
    createCSV({
      rows,
      columns,
    });

  downloadBlob(
    blob,
    fileName
  );

  return blob;
}

/* =========================================================
   CREATE EXCEL
========================================================= */

export async function createExcel<T>({
  rows,
  columns,
  sheetName,
}: Omit<ExcelExportOptions<T>, "fileName">): Promise<Blob> {
  const workbook = new ExcelJS.Workbook();

  workbook.creator = "Kotoze";
  workbook.lastModifiedBy = "Kotoze";
  workbook.created = new Date();
  workbook.modified = new Date();

  const worksheet = workbook.addWorksheet(sheetName);

  worksheet.columns = [
    { header: "No.", key: "__serial", width: 9 },
    ...columns.map((column) => ({
      header: column.header,
      key: String(column.key),
      width: column.width ?? 18,
    })),
  ];

  rows.forEach((row, index) => {
    const data: Record<string, string | number> = {
      __serial: index + 1,
    };

    columns.forEach((column) => {
      data[String(column.key)] = getColumnValue(row, column);
    });

    worksheet.addRow(data);
  });

  const headerRow = worksheet.getRow(1);
  headerRow.height = 28;

  headerRow.eachCell((cell) => {
    cell.font = {
      name: "Arial",
      size: 12,
      bold: true,
      color: { argb: "FFFFFFFF" },
    };

    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF2F7D5A" },
    };

    cell.alignment = {
      horizontal: "center",
      vertical: "middle",
      wrapText: true,
    };

    cell.border = {
      top: { style: "thin", color: { argb: "FF246448" } },
      bottom: { style: "thin", color: { argb: "FF246448" } },
      left: { style: "thin", color: { argb: "FF246448" } },
      right: { style: "thin", color: { argb: "FF246448" } },
    };
  });

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;

    row.eachCell((cell) => {
      cell.font = {
        name: "Arial",
        size: 11,
        color: { argb: "FF1F2937" },
      };

      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFFFFFF" },
      };

      cell.alignment = {
        vertical: "middle",
        wrapText: true,
      };

      cell.border = {
        top: { style: "thin", color: { argb: "FFD1D5DB" } },
        left: { style: "thin", color: { argb: "FFD1D5DB" } },
        bottom: { style: "thin", color: { argb: "FFD1D5DB" } },
        right: { style: "thin", color: { argb: "FFD1D5DB" } },
      };
    });

    row.getCell(1).alignment = {
      horizontal: "center",
      vertical: "middle",
    };
  });

  worksheet.views = [{
    state: "frozen",
    ySplit: 1,
  }];

  worksheet.pageSetup = {
    orientation: "landscape",
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 0,
    paperSize: 9,
    margins: {
      left: 0.25,
      right: 0.25,
      top: 0.5,
      bottom: 0.5,
      header: 0.2,
      footer: 0.2,
    },
  };

  const buffer = await workbook.xlsx.writeBuffer();

  return new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
}

/* =========================================================
   EXPORT EXCEL
========================================================= */

export async function exportExcel<T>({
  rows,
  columns,
  sheetName,
  fileName,
}: ExcelExportOptions<T>): Promise<Blob> {
  const blob =
    await createExcel({
      rows,
      columns,
      sheetName,
    });

  downloadBlob(
    blob,
    fileName
  );

  return blob;
}

/* =========================================================
   CREATE PDF
========================================================= */

export function createPDF<T>({
  title,
  subtitle,
  search,
  rows,
  columns,
  autoPrint = false,
}: PdfExportOptions<T>): Blob | null {
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

  /* -------------------------------------------------------
     BRAND
  ------------------------------------------------------- */

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.setFontSize(18);

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
    ` - ${title}`,
    14 + kotozeWidth,
    17
  );

  /* -------------------------------------------------------
     SUBTITLE
  ------------------------------------------------------- */

  if (subtitle) {
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
      subtitle,
      14,
      23
    );
  }

  /* -------------------------------------------------------
     META
  ------------------------------------------------------- */

  doc.setFontSize(8);

  doc.setTextColor(
    107,
    114,
    128
  );

  const meta =
    `Showing ${rows.length} record${
      rows.length === 1
        ? ""
        : "s"
    }${
      search?.trim()
        ? `  •  Search: "${search.trim()}"`
        : ""
    }`;

  doc.text(
    meta,
    14,
    29
  );

  /* -------------------------------------------------------
     TABLE
  ------------------------------------------------------- */

  const head = [
    [
      "No.",
      ...columns.map(
        (column) =>
          column.header
      ),
    ],
  ];

  const body =
    rows.map(
      (row, index) => [
        String(index + 1),

        ...columns.map(
          (column) =>
            String(
              getColumnValue(
                row,
                column
              )
            )
        ),
      ]
    );

  autoTable(
    doc,
    {
      startY: 34,

      head,

      body,

      theme: "grid",

      tableWidth:
        pageWidth - 28,

      margin: {
        left: 14,
        right: 14,
      },

      styles: {
        font:
          "helvetica",

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

        valign:
          "middle",

        overflow:
          "linebreak",

        halign:
          "left",
      },

      headStyles: {
        font:
          "helvetica",

        fontStyle:
          "bold",

        fontSize: 10,

        textColor: [
          255,
          255,
          255,
        ],

        fillColor: [
          47,
          125,
          90,
        ],

        lineColor: [
          36,
          100,
          72,
        ],

        lineWidth: 0.25,

        halign:
          "center",

        valign:
          "middle",

        cellPadding: 3.2,
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
            align: "right",
          }
        );
      },
    }
  );

  /* -------------------------------------------------------
     PRINT
  ------------------------------------------------------- */

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

/* =========================================================
   EXPORT PDF
========================================================= */

export function exportPDF<T>(
  options: PdfExportOptions<T>
): Blob | null {
  const blob =
    createPDF(
      options
    );

  if (!blob) {
    return null;
  }

  if (options.fileName) {
    downloadBlob(
      blob,
      options.fileName
    );
  }

  return blob;
}

/* =========================================================
   PRINT
========================================================= */

export function printPDF<T>(
  options: Omit<
    PdfExportOptions<T>,
    "fileName"
  >
): void {
  createPDF(
    {
      ...options,

      autoPrint: true,
    }
  );
}