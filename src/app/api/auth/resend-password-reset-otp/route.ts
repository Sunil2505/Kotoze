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

    /*
     * ================================================
     * VALIDATION
     * ================================================
     */

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

    /*
     * ================================================
     * RESEND PASSWORD RESET OTP
     * ================================================
     */

    const result =
      await authService.resendPasswordResetOtp(
        challengeId
      );

    return NextResponse.json(
      {
        success: true,
        message:
          "A new OTP has been sent to your registered mobile number.",
        challengeId:
          result.challengeId,
        expiresAt:
          result.expiresAt,
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    console.error(
      "Resend Password Reset OTP API:",
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