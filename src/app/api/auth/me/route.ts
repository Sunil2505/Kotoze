import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { getAuthenticatedUser } from "@/lib/auth/authenticatedUser";

export async function GET(
  request: NextRequest
) {
  try {
    await connectDB();

    const user =
      await getAuthenticatedUser(request);

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message:
          error.message ||
          "Authentication failed.",
      },
      {
        status: error.statusCode ?? 401,
      }
    );
  }
}