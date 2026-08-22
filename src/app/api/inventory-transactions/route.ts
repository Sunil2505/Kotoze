import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import InventoryTransactionService from "@/services/InventoryTransactionService";
import { getAuthenticatedUser } from "@/lib/auth/authenticatedUser";
import { requireRole } from "@/lib/auth/authorization";

const inventoryTransactionService =
  new InventoryTransactionService();

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

    const transactions =
      await inventoryTransactionService.getAll();

    return NextResponse.json({
      data: transactions,
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

    const transaction =
      await inventoryTransactionService.createTransaction(
        body
      );

    return NextResponse.json(
      {
        data: transaction,
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