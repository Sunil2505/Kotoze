import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import BrandService from "@/services/BrandService";
import { getAuthenticatedUser } from "@/lib/auth/authenticatedUser";
import { requireRole } from "@/lib/auth/authorization";

const brandService = new BrandService();

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

    const brands =
      await brandService.getAll();

    return NextResponse.json({
      data: brands,
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

    const brand =
      await brandService.createBrand(body);

    return NextResponse.json(
      {
        data: brand,
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