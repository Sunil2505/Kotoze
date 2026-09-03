import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import AuthService from "@/services/AuthService";

const authService =
  new AuthService();

export async function POST(
  request: NextRequest
) {
  try {
    await connectDB();

    const body =
      await request.json();

    const challengeId =
      typeof body.challengeId === "string"
        ? body.challengeId.trim()
        : "";

    const otp =
      typeof body.otp === "string"
        ? body.otp.trim()
        : "";

    if (!challengeId) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid OTP challenge.",
        },
        {
          status: 400,
        }
      );
    }

    if (!/^\d{6}$/.test(otp)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please enter the 6-digit OTP.",
        },
        {
          status: 400,
        }
      );
    }

    const result =
      await authService.verifyPasswordResetOtp(
        challengeId,
        otp
      );

    return NextResponse.json(
      {
        success: true,

        message:
          "OTP verified successfully.",

        resetToken:
          result.resetToken,
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    console.error(
      "Verify Reset OTP API:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        message:
          error.message ??
          "OTP verification failed.",
      },
      {
        status:
          error.statusCode ?? 500,
      }
    );
  }
}