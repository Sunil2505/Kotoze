import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import InventoryService from "@/services/InventoryService";
import { getAuthenticatedUser } from "@/lib/auth/authenticatedUser";
import { requireRole } from "@/lib/auth/authorization";

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

    const user =
      await getAuthenticatedUser(request);

    requireRole(
      user.roleId.code,
      "SUPER_ADMIN"
    );

    const { id } = await params;

    const inventory =
      await InventoryService.getById(id);

    return NextResponse.json(inventory);
  } catch (error: any) {
    return NextResponse.json(
      {
        message:
          error.message ||
          "Inventory not found.",
      },
      {
        status: error.statusCode ?? 404,
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

    const user =
      await getAuthenticatedUser(request);

    requireRole(
      user.roleId.code,
      "SUPER_ADMIN"
    );

    const { id } = await params;

    const body =
      await request.json();

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
          error.message ||
          "Failed to update inventory.",
      },
      {
        status: error.statusCode ?? 400,
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

    const user =
      await getAuthenticatedUser(request);

    requireRole(
      user.roleId.code,
      "SUPER_ADMIN"
    );

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
          error.message ||
          "Failed to delete inventory.",
      },
      {
        status: error.statusCode ?? 400,
      }
    );
  }
}