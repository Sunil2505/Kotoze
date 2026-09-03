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

    const username =
      typeof body.username === "string"
        ? body.username.trim()
        : "";

    const contact =
      typeof body.contact === "string"
        ? body.contact.trim()
        : "";

    if (!username) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please enter your username.",
        },
        {
          status: 400,
        }
      );
    }

    if (!contact) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please enter your registered mobile number or email.",
        },
        {
          status: 400,
        }
      );
    }

    try {
      const result =
        await authService.requestPasswordReset(
          username,
          contact
        );

      return NextResponse.json(
        {
          success: true,
          message:
            "If the account exists, a password reset OTP has been sent to the registered mobile number.",
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
      /*
       * IMPORTANT:
       *
       * Username is intentionally validated
       * before the contact is checked.
       *
       * This allows the frontend to show
       * the appropriate username/contact
       * validation message.
       */

      if (
        error?.statusCode === 404 ||
        error?.statusCode === 403
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              error.message ??
              "Unable to process password reset request.",
          },
          {
            status:
              error.statusCode,
          }
        );
      }

      throw error;
    }
  } catch (error: any) {
    console.error(
      "Forgot Password API:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error?.message ??
          "Unable to process password reset request.",
      },
      {
        status:
          error?.statusCode ??
          500,
      }
    );
  }
}