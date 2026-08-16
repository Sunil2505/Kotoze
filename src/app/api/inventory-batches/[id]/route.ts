import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import InventoryBatchService from "@/services/InventoryBatchService";

const inventoryBatchService =
  new InventoryBatchService();

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

// GET /api/inventory-batches/:id
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    await connectDB();

    const { id } = await context.params;

    const batch =
      await inventoryBatchService.getById(id);

    return NextResponse.json({
      data: batch,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error.message,
      },
      {
        status: error.statusCode ?? 404,
      }
    );
  }
}

// PUT /api/inventory-batches/:id
export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    await connectDB();

    const { id } = await context.params;

    const body = await request.json();

    const batch =
      await inventoryBatchService.updateBatch(
        id,
        body
      );

    return NextResponse.json({
      data: batch,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error.message,
      },
      {
        status: error.statusCode ?? 400,
      }
    );
  }
}

// DELETE /api/inventory-batches/:id
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    await connectDB();

    const { id } = await context.params;

    await inventoryBatchService.deleteBatch(id);

    return NextResponse.json({
      data: {
        success: true,
      },
      message: "Inventory batch deleted successfully.",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error.message,
      },
      {
        status: error.statusCode ?? 400,
      }
    );
  }
}