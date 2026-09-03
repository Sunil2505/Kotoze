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

    const resetToken =
      typeof body.resetToken === "string"
        ? body.resetToken.trim()
        : "";

    const newPassword =
      typeof body.newPassword === "string"
        ? body.newPassword
        : "";

    const confirmPassword =
      typeof body.confirmPassword === "string"
        ? body.confirmPassword
        : "";

    /*
     * ================================================
     * VALIDATION
     * ================================================
     */

    if (!resetToken) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid password reset request.",
        },
        {
          status: 400,
        }
      );
    }

    if (!newPassword) {
      return NextResponse.json(
        {
          success: false,
          message:
            "New password is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Password must be at least 6 characters.",
        },
        {
          status: 400,
        }
      );
    }

    if (!confirmPassword) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please confirm your new password.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      newPassword !==
      confirmPassword
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Passwords do not match.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * ================================================
     * RESET PASSWORD
     * ================================================
     *
     * AuthService validates the resetToken,
     * identifies the user securely, hashes the
     * new password and consumes the token.
     */
    await authService.resetPassword(
      resetToken,
      newPassword
    );

    return NextResponse.json(
      {
        success: true,
        message:
          "Password reset successfully.",
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    console.error(
      "Reset Password API:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error?.message ??
          "Unable to reset password.",
      },
      {
        status:
          error?.statusCode ??
          500,
      }
    );
  }
}