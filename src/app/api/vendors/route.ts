import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import VendorService from "@/services/VendorService";

import { getAuthenticatedUser } from "@/lib/auth/authenticatedUser";
import { requireRole } from "@/lib/auth/authorization";

const vendorService = new VendorService();

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

    const vendors =
      await vendorService.getAll();

    return NextResponse.json({
      data: vendors,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        message:
          error.message ||
          "Failed to fetch vendors.",
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

    const vendor =
      await vendorService.createVendor(
        body
      );

    return NextResponse.json(
      {
        data: vendor,
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
          "Failed to create vendor.",
      },
      {
        status: error.statusCode ?? 400,
      }
    );
  }
}