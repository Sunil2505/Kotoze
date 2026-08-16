import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import InventoryService from "@/services/InventoryService";

export async function GET() {
  try {
    await connectDB();

    const inventories =
      await InventoryService.getAll();

      return NextResponse.json({
        data: inventories,
      });
  } catch (error: any) {
    return NextResponse.json(
      {
        message:
          error.message || "Failed to fetch inventory.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(
  request: NextRequest
) {
  try {
    await connectDB();

    const body = await request.json();

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
        status: 400,
      }
    );
  }
}