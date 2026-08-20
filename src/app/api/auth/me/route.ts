import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { verifyAccessToken } from "@/lib/auth/jwt";
import AuthService from "@/services/AuthService";

const authService = new AuthService();

export async function GET(
  request: NextRequest
) {
  try {
    await connectDB();

    const token =
      request.cookies.get(
        "kotoze_access_token"
      )?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication required.",
        },
        {
          status: 401,
        }
      );
    }

    const payload =
      await verifyAccessToken(token);

    const user =
      await authService.getCurrentUser(
        payload.userId
      );

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