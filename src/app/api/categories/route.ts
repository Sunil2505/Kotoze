import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import CategoryService from "@/services/CategoryService";
import { getAuthenticatedUser } from "@/lib/auth/authenticatedUser";
import { requireRole } from "@/lib/auth/authorization";

const categoryService = new CategoryService();

/**
 * GET /api/categories
 */
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

    const categories =
      await categoryService.getAll();

    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
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

/**
 * POST /api/categories
 */
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

    const category =
      await categoryService.createCategory(
        body
      );

    return NextResponse.json(
      {
        success: true,
        message:
          "Category created successfully.",
        data: category,
      },
      {
        status: 201,
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
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