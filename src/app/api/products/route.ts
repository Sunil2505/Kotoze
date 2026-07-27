import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import ProductService from "@/services/ProductService";

const productService = new ProductService();

export async function GET() {
  try {
    await connectDB();

    const products = await productService.getAll();

    return NextResponse.json(products);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    const product =
      await productService.createProduct(body);

    return NextResponse.json(product, {
      status: 201,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message },
      { status: 400 }
    );
  }
}