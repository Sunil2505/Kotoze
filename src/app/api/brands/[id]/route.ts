import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import BrandService from "@/services/BrandService";

const brandService = new BrandService();

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

// GET /api/brands/:id
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    await connectDB();

    const { id } = await context.params;

    const brand = await brandService.getById(id);

    return NextResponse.json({
      data: brand,
    });
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

// PUT /api/brands/:id
export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    await connectDB();

    const { id } = await context.params;

    const body = await request.json();

    const brand = await brandService.updateBrand(
      id,
      body
    );

    return NextResponse.json({
      data: brand,
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

// DELETE /api/brands/:id
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    await connectDB();

    const { id } = await context.params;

    await brandService.deleteBrand(id);

    return NextResponse.json({
      data: {
        success: true,
      },
      message: "Brand deleted successfully.",
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