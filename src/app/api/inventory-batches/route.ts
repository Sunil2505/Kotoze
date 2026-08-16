import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import InventoryBatchService from "@/services/InventoryBatchService";

const inventoryBatchService =
  new InventoryBatchService();

export async function GET() {
  try {
    await connectDB();

    const batches =
      await inventoryBatchService.getAll();

    return NextResponse.json({
      data: batches,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error.message,
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

    const batch =
      await inventoryBatchService.createBatch(body);

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
        message: error.message,
      },
      {
        status: 400,
      }
    );
  }
}