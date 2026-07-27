import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import ProductService from "@/services/ProductService";

const productService = new ProductService();

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

// GET /api/products/:id
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    await connectDB();

    const { id } = await context.params;

    const product = await productService.getById(id);

    return NextResponse.json(product);
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

// PUT /api/products/:id
export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    await connectDB();

    const { id } = await context.params;

    const body = await request.json();

    const product =
      await productService.updateProduct(id, body);

    return NextResponse.json(product);
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

// DELETE /api/products/:id
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    await connectDB();

    const { id } = await context.params;

    await productService.deleteProduct(id);

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully.",
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