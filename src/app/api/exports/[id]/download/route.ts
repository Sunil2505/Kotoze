import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import ExportService from "@/services/ExportService";

const exportService =
  new ExportService();

function getContentType(
  fileType: string
) {
  switch (fileType) {
    case "pdf":
      return "application/pdf";

    case "xlsx":
      return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

    case "csv":
      return "text/csv";

    default:
      return "application/octet-stream";
  }
}

export async function GET(
  _request: NextRequest,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    await connectDB();

    const { id } =
      await context.params;

    const exportRecord =
      await exportService.findById(
        id
      );

    if (!exportRecord) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Export not found.",
        },
        {
          status: 404,
        }
      );
    }

    if (
      exportRecord.isDeleted
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Export has been deleted.",
        },
        {
          status: 404,
        }
      );
    }

    if (
      exportRecord.status !==
      "completed"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Export file is not ready.",
        },
        {
          status: 409,
        }
      );
    }

    const exists =
      await exportService.fileExists(
        exportRecord.storageKey
      );

    if (!exists) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Export file could not be found.",
        },
        {
          status: 404,
        }
      );
    }

    const buffer =
      await exportService.readFile(
        exportRecord.storageKey
      );

    const contentType =
      getContentType(
        exportRecord.fileType
      );

    return new NextResponse(
      new Uint8Array(buffer),
      {
        status: 200,
        headers: {
          "Content-Type":
            contentType,

          "Content-Disposition":
            `attachment; filename="${encodeURIComponent(
              exportRecord.fileName
            )}"`,

          "Content-Length":
            String(buffer.length),

          "Cache-Control":
            "private, no-cache, no-store, max-age=0",
        },
      }
    );

  } catch (error) {
    console.error(
      "GET /api/exports/[id]/download:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to download export.",
      },
      {
        status: 500,
      }
    );
  }
}