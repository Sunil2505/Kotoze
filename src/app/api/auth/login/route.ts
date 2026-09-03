import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import AuthService from "@/services/AuthService";
import { LoginSchema } from "@/validations/AuthValidation";

const authService =
  new AuthService();

export async function POST(
  request: NextRequest
) {
  try {
    await connectDB();

    const body =
      await request.json();

    const result =
      LoginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Validation failed.",
          errors:
            result.error.flatten(),
        },
        {
          status: 400,
        }
      );
    }

    const {
      login,
      password,
      rememberMe = false,
    } = result.data;

    const authResult =
      await authService.login(
        login,
        password,
        Boolean(rememberMe)
      );

    /*
     * Admin and Super Admin
     *
     * Password is correct, but OTP
     * verification is still required.
     */
    if (authResult.requiresOtp) {
      return NextResponse.json(
        {
          success: true,
          requiresOtp: true,
          message:
            "OTP verification required.",
          challengeId:
            authResult.challengeId,
          expiresAt:
            authResult.expiresAt,
          user: authResult.user,
        },
        {
          status: 200,
        }
      );
    }

    /*
     * Non-privileged users currently
     * complete login without OTP.
     *
     * Access-token generation for the
     * final authentication flow will be
     * handled in the next step.
     */
    return NextResponse.json(
      {
        success: true,
        requiresOtp: false,
        message:
          "Login successful.",
        user: authResult.user,
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    console.error(
      "Login API:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error.message ??
          "Login failed.",
      },
      {
        status:
          error.statusCode ?? 500,
      }
    );
  }
}