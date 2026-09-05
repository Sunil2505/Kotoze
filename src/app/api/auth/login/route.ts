import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import AuthService from "@/services/AuthService";
import { LoginSchema } from "@/validations/AuthValidation";
import { generateAccessToken } from "@/lib/auth/jwt";

const authService = new AuthService();

export async function POST(
  request: NextRequest
) {
  try {
    await connectDB();

    const body = await request.json();

    const result =
      LoginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed.",
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
     * =================================================
     * ADMIN / SUPER ADMIN
     * =================================================
     *
     * Password is correct.
     * OTP verification is still required.
     *
     * Access token will be generated only after
     * successful OTP verification.
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
     * =================================================
     * STAFF / VENDOR / CUSTOMER
     * =================================================
     *
     * These users do not require OTP.
     *
     * Password authentication is already successful,
     * so generate the final access token here.
     */
    const userId =
      authResult.user._id.toString();

const roleId =
  authResult.user.roleId._id.toString();

    const accessToken =
      await generateAccessToken(
        {
          userId,
          roleId,
        },
        Boolean(rememberMe)
      );

    const response =
      NextResponse.json(
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

    /*
     * =================================================
     * ACCESS TOKEN COOKIE
     * =================================================
     *
     * Remember Me OFF:
     *   15 minutes
     *
     * Remember Me ON:
     *   30 days
     */
    response.cookies.set(
      "kotoze_access_token",
      accessToken,
      {
        httpOnly: true,

        secure:
          process.env.NODE_ENV ===
          "production",

        sameSite: "lax",

        path: "/",

        maxAge: Boolean(
          rememberMe
        )
          ? 30 * 24 * 60 * 60
          : 15 * 60,
      }
    );

    return response;
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