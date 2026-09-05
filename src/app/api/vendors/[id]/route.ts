import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import VendorService from "@/services/VendorService";
import { getAuthenticatedUser } from "@/lib/auth/authenticatedUser";
import { requireRole } from "@/lib/auth/authorization";

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

    const user =
      await getAuthenticatedUser(request);

    requireRole(
      user.roleId.code,
      [
        "SUPER_ADMIN",
        "ADMIN",
        "STAFF",
      ]
    );

    const { id } =
      await context.params;

    const vendor =
      await vendorService.getById(id);

    return NextResponse.json({
      success: true,
      message:
        "Vendor fetched successfully.",
      data: vendor,
    });
  } catch (error: any) {
    console.error(
      "Vendor GET API:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error.message ??
          "Failed to fetch vendor.",
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

    const user =
      await getAuthenticatedUser(request);

    requireRole(
      user.roleId.code,
      [
        "SUPER_ADMIN",
        "ADMIN",
        "STAFF",
      ]
    );

    const { id } =
      await context.params;

    const body =
      await request.json();

    const vendor =
      await vendorService.updateVendor(
        id,
        body
      );

    return NextResponse.json({
      success: true,
      message:
        "Vendor updated successfully.",
      data: vendor,
    });
  } catch (error: any) {
    console.error(
      "Vendor PUT API:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error.message ??
          "Failed to update vendor.",
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

    const user =
      await getAuthenticatedUser(request);

    requireRole(
      user.roleId.code,
      [
        "SUPER_ADMIN",
        "ADMIN",
        "STAFF",
      ]
    );

    const { id } =
      await context.params;

    await vendorService.deleteVendor(id);

    return NextResponse.json({
      success: true,
      message:
        "Vendor deleted successfully.",
    });
  } catch (error: any) {
    console.error(
      "Vendor DELETE API:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error.message ??
          "Failed to delete vendor.",
      },
      {
        status: error.statusCode ?? 400,
      }
    );
  }
}