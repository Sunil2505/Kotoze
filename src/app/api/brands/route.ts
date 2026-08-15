import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import BrandService from "@/services/BrandService";

const brandService = new BrandService();

export async function GET() {
  try {
    await connectDB();

    const brands = await brandService.getAll();

    return NextResponse.json({
      data: brands,
    });
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

    const brand = await brandService.createBrand(body);

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
        message: error.message,
      },
      {
        status: 400,
      }
    );
  }
}