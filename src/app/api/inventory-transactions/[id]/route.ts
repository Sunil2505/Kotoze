import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import InventoryTransactionService from "@/services/InventoryTransactionService";

const inventoryTransactionService =
  new InventoryTransactionService();

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

// GET /api/inventory-transactions/:id
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    await connectDB();

    const { id } = await context.params;

    const transaction =
      await inventoryTransactionService.getById(id);

    return NextResponse.json({
      data: transaction,
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

// DELETE /api/inventory-transactions/:id
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    await connectDB();

    const { id } = await context.params;

    await inventoryTransactionService.deleteTransaction(
      id
    );

    return NextResponse.json({
      data: {
        success: true,
      },
      message:
        "Inventory transaction deleted successfully.",
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