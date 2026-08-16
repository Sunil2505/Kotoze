import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import InventoryTransactionService from "@/services/InventoryTransactionService";

const inventoryTransactionService =
  new InventoryTransactionService();

export async function GET() {
  try {
    await connectDB();

    const transactions =
      await inventoryTransactionService.getAll();

    return NextResponse.json({
      data: transactions,
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
        message: error.message,
      },
      {
        status: 400,
      }
    );
  }
}