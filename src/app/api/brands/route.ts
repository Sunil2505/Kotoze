import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import VendorService from "@/services/VendorService";

const vendorService = new VendorService();

export async function GET() {
  try {
    await connectDB();

    const vendors = await vendorService.getAll();

    return NextResponse.json(vendors);
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

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    const vendor =
      await vendorService.createVendor(body);

    return NextResponse.json(vendor, {
      status: 201,
    });
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