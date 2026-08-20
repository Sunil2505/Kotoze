import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import ProductService from "@/services/ProductService";
import { getAuthenticatedUser } from "@/lib/auth/authenticatedUser";
import { requireRole } from "@/lib/auth/authorization";

const productService = new ProductService();

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

    const products =
      await productService.getAll();

    return NextResponse.json({
      data: products,
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

    const product =
      await productService.createProduct(
        body
      );

    return NextResponse.json(
      {
        data: product,
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