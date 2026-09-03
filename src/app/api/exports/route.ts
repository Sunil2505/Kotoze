import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import ExportService from "@/services/ExportService";

const exportService =
  new ExportService();

/* =========================
   GET EXPORTS
========================= */

export async function GET(
  request: NextRequest
) {
  try {
    await connectDB();

    const { searchParams } =
      new URL(request.url);

    const module =
      searchParams.get("module");

    const createdBy =
      searchParams.get("createdBy");

    const limitParam =
      searchParams.get("limit");

    const parsedLimit =
      limitParam
        ? Number(limitParam)
        : 20;

    const limit =
      Number.isFinite(
        parsedLimit
      ) &&
      parsedLimit > 0
        ? Math.min(
            parsedLimit,
            100
          )
        : 20;

    let exports;

    if (module) {
      exports =
        await exportService.findByModule(
          module
        );
    } else if (createdBy) {
      exports =
        await exportService.findByUser(
          createdBy
        );
    } else {
      exports =
        await exportService.findRecent(
          limit
        );
    }

    return NextResponse.json({
      success: true,
      data: exports,
    });

  } catch (error) {
    console.error(
      "GET /api/exports:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to fetch exports.",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================
   CREATE EXPORT
========================= */

export async function POST(
  request: NextRequest
) {
  try {
    await connectDB();

    const formData =
      await request.formData();

    const file =
      formData.get("file");

    const fileName =
      formData.get("fileName");

    const fileType =
      formData.get("fileType");

    const module =
      formData.get("module");

    const createdBy =
      formData.get("createdBy");

    /* =========================
       VALIDATION
    ========================== */

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "File is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      typeof fileName !==
        "string" ||
      !fileName.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "File name is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      fileType !== "csv" &&
      fileType !== "xlsx" &&
      fileType !== "pdf"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid file type.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      typeof module !==
        "string" ||
      !module.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Module is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      typeof createdBy !==
        "string" ||
      !createdBy.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Created by is required.",
        },
        {
          status: 400,
        }
      );
    }

    /* =========================
       FILE BUFFER
    ========================== */

    const arrayBuffer =
      await file.arrayBuffer();

    const buffer =
      Buffer.from(
        arrayBuffer
      );

    /* =========================
       CREATE EXPORT
    ========================== */

    const exportRecord =
      await exportService.createExport(
        {
          fileName:
            fileName.trim(),

          fileType:
            fileType as
              | "csv"
              | "xlsx"
              | "pdf",

          module:
            module.trim(),

          createdBy:
            createdBy.trim(),

          buffer,
        }
      );

    return NextResponse.json(
      {
        success: true,

        message:
          "Export created successfully.",

        data: exportRecord,
      },
      {
        status: 201,
      }
    );

  } catch (error) {
    console.error(
      "POST /api/exports:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to create export.",
      },
      {
        status: 500,
      }
    );
  }
}