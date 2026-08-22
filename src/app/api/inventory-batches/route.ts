import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import InventoryBatchService from "@/services/InventoryBatchService";
import { getAuthenticatedUser } from "@/lib/auth/authenticatedUser";
import { requireRole } from "@/lib/auth/authorization";

const inventoryBatchService =
  new InventoryBatchService();

export async function GET(
  request: NextRequest
) {
  try {
    await connectDB();

    const user =
      await getAuthenticatedUser(request);

    requireRole(
      user.roleId.code,
      "SUPER_ADMIN"
    );

    const batches =
      await inventoryBatchService.getAll();

    return NextResponse.json({
      data: batches,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        message:
          error.message ??
          "Something went wrong.",
      },
      {
        status: error.statusCode ?? 500,
      }
    );
  }
}

export async function POST(
  request: NextRequest
) {
  try {
    await connectDB();

    const user =
      await getAuthenticatedUser(request);

    requireRole(
      user.roleId.code,
      "SUPER_ADMIN"
    );

    const body =
      await request.json();

    const batch =
      await inventoryBatchService.createBatch(
        body
      );

    return NextResponse.json(
      {
        data: batch,
      },
      {
        status: 201,
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message:
          error.message ??
          "Something went wrong.",
      },
      {
        status: error.statusCode ?? 400,
      }
    );
  }
}