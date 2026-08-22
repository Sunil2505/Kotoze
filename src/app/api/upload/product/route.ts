import { NextRequest, NextResponse } from "next/server";

import fs from "fs/promises";
import path from "path";
import sharp from "sharp";

import { getAuthenticatedUser } from "@/lib/auth/authenticatedUser";
import { requireRole } from "@/lib/auth/authorization";

export async function POST(
  request: NextRequest
) {
  try {
    const user =
      await getAuthenticatedUser(request);

    requireRole(
      user.roleId.code,
      "SUPER_ADMIN"
    );

    const formData =
      await request.formData();

    const file =
      formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          message: "No image selected.",
        },
        { status: 400 }
      );
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Only JPG, PNG and WEBP images are allowed.",
        },
        { status: 400 }
      );
    }

    const maxSize =
      2 * 1024 * 1024;

    if (file.size > maxSize) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Image size must be less than 2MB.",
        },
        { status: 400 }
      );
    }

    const bytes =
      await file.arrayBuffer();

    const buffer =
      Buffer.from(bytes);

    const uploadDir =
      path.join(
        process.cwd(),
        "public",
        "uploads",
        "products"
      );

    await fs.mkdir(
      uploadDir,
      {
        recursive: true,
      }
    );

    const filename =
      `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 8)}.webp`;

    const outputPath =
      path.join(
        uploadDir,
        filename
      );

    await sharp(buffer)
      .resize(600, 600, {
        fit: "cover",
      })
      .webp({
        quality: 85,
      })
      .toFile(outputPath);

    return NextResponse.json({
      success: true,
      url: `/uploads/products/${filename}`,
    });
  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message:
          error.message ||
          "Image upload failed.",
      },
      {
        status:
          error.statusCode ?? 500,
      }
    );
  }
}