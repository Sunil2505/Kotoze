import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import ExportService from "@/services/ExportService";

const exportService =
  new ExportService();

export async function DELETE(
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
            "Export has already been deleted.",
        },
        {
          status: 404,
        }
      );
    }

    const deleted =
      await exportService.deleteExport(
        id
      );

    if (!deleted) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Failed to delete export.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Export deleted successfully.",
      data: deleted,
    });

  } catch (error) {
    console.error(
      "DELETE /api/exports/[id]:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to delete export.",
      },
      {
        status: 500,
      }
    );
  }
}