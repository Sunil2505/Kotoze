import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import VendorService from "@/services/VendorService";

const vendorService = new VendorService();

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

// GET /api/vendors/:id
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    await connectDB();

    const { id } = await context.params;

    const vendor = await vendorService.getById(id);

    return NextResponse.json(vendor);
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

// PUT /api/vendors/:id
export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    await connectDB();

    const { id } = await context.params;

    const body = await request.json();

    const vendor = await vendorService.updateVendor(
      id,
      body
    );

    return NextResponse.json(vendor);
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

// DELETE /api/vendors/:id
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    await connectDB();

    const { id } = await context.params;

    await vendorService.deleteVendor(id);

    return NextResponse.json({
      success: true,
      message: "Vendor deleted successfully.",
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