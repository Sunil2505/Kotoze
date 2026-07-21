import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import CategoryService from "@/services/CategoryService";

const categoryService = new CategoryService();

/**
 * GET /api/categories
 */
export async function GET() {
  try {
    await connectDB();

    const categories = await categoryService.getAll();

    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong.",
      },
      {
        status: 500,
      }
    );
  }
}

/**
 * POST /api/categories
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    const category =
      await categoryService.createCategory(body);

    return NextResponse.json(
      {
        success: true,
        message: "Category created successfully.",
        data: category,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong.",
      },
      {
        status: 500,
      }
    );
  }
}