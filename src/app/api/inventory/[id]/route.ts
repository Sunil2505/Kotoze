import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import InventoryService from "@/services/InventoryService";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    await connectDB();

    const { id } = await params;

    const inventory =
      await InventoryService.getById(id);

    return NextResponse.json(inventory);
  } catch (error: any) {
    return NextResponse.json(
      {
        message:
          error.message || "Inventory not found.",
      },
      {
        status: 404,
      }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    await connectDB();

    const { id } = await params;

    const body = await request.json();

    const inventory =
      await InventoryService.updateInventory(
        id,
        body
      );

    return NextResponse.json(inventory);
  } catch (error: any) {
    return NextResponse.json(
      {
        message:
          error.message || "Failed to update inventory.",
      },
      {
        status: 400,
      }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    await connectDB();

    const { id } = await params;

    const result =
      await InventoryService.deleteInventory(
        id
      );

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      {
        message:
          error.message || "Failed to delete inventory.",
      },
      {
        status: 400,
      }
    );
  }
}