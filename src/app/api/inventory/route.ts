import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import InventoryService from "@/services/InventoryService";
import { getAuthenticatedUser } from "@/lib/auth/authenticatedUser";
import { requireRole } from "@/lib/auth/authorization";

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

    const inventories =
      await InventoryService.getAll();

    return NextResponse.json({
      data: inventories,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        message:
          error.message ||
          "Failed to fetch inventory.",
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

    const inventory =
      await InventoryService.increaseStock({
        productId: body.productId,

        batchId: body.batchId,
        batchNumber: body.batchNumber,
        expiryDate: body.expiryDate,
        costPrice: body.costPrice,

        quantity: body.quantity,

        transactionType:
          body.transactionType,

        referenceType:
          body.referenceType,

        referenceId:
          body.referenceId,

        referenceNumber:
          body.referenceNumber,

        remarks: body.remarks,

        createdBy:
          body.createdBy,
      });

    return NextResponse.json(
      {
        data: inventory,
      },
      {
        status: 201,
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message:
          error.message ||
          "Failed to create inventory.",
      },
      {
        status: error.statusCode ?? 400,
      }
    );
  }
}