import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import AuthService from "@/services/AuthService";

const authService = new AuthService();

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    const challengeId =
      typeof body.challengeId === "string"
        ? body.challengeId.trim()
        : "";

    if (!challengeId) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid OTP challenge.",
        },
        {
          status: 400,
        }
      );
    }

    const result =
      await authService.resendLoginOtp(challengeId);

    return NextResponse.json(
      {
        success: true,
        message: "A new OTP has been sent.",
        challengeId: result.challengeId,
        expiresAt: result.expiresAt,
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    console.error(
      "Resend Login OTP API:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error?.message ??
          "Unable to resend OTP. Please try again.",
      },
      {
        status:
          error?.statusCode ??
          500,
      }
    );
  }
}