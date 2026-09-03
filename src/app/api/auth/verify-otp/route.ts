import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { connectDB } from "@/lib/mongodb";
import OtpService from "@/services/OtpService";
import AuthService from "@/services/AuthService";
import UserRepository from "@/repositories/UserRepository";
import { generateAccessToken } from "@/lib/auth/jwt";

const VerifyOtpSchema = z.object({
  challengeId: z
    .string()
    .trim()
    .min(1, "OTP challenge is required."),

  otp: z
    .string()
    .trim()
    .regex(
      /^\d{6}$/,
      "OTP must be 6 digits."
    ),
});

const otpService =
  new OtpService();

const authService =
  new AuthService();

const userRepository =
  new UserRepository();

/*
 * Authentication cookie lifetime.
 *
 * Remember Me OFF:
 *   15 minutes
 *
 * Remember Me ON:
 *   30 days
 */
const SESSION_MAX_AGE =
  60 * 15;

const REMEMBER_ME_MAX_AGE =
  60 * 60 * 24 * 30;

export async function POST(
  request: NextRequest
) {
  try {
    await connectDB();

    const body =
      await request.json();

    const result =
      VerifyOtpSchema.safeParse(body);

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
      challengeId,
      otp,
    } = result.data;

    /*
     * Verify OTP.
     *
     * This checks:
     * - challenge validity
     * - expiry
     * - maximum attempts
     * - OTP hash
     * - OTP reuse
     *
     * It also returns the Remember Me
     * preference stored in the challenge.
     */
    const verification =
      await otpService.verifyOtp(
        challengeId,
        otp
      );

    const userId =
      verification.userId;

    const rememberMe =
      Boolean(
        verification.rememberMe
      );

    /*
     * Load the authenticated user
     * with role information.
     */
    const user =
      await authService.getCurrentUser(
        userId
      );

    const roleCode =
      (user.roleId as any)?.code;

    /*
     * OTP login is currently mandatory
     * only for privileged accounts.
     */
    if (
      roleCode !== "SUPER_ADMIN" &&
      roleCode !== "ADMIN"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "OTP authentication is not enabled for this account.",
        },
        {
          status: 403,
        }
      );
    }

    /*
     * Update last login time only after
     * successful OTP verification.
     */
    const updatedUser =
      await userRepository.updateLastLoginAt(
        userId
      );

    if (!updatedUser) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Unable to update login information.",
        },
        {
          status: 500,
        }
      );
    }

    /*
     * Access token is generated ONLY after
     * successful OTP verification.
     */
    const token =
      await generateAccessToken({
        userId,
        roleId:
          user.roleId._id.toString(),
      });

    const {
      passwordHash: _passwordHash,
      ...userResponse
    } =
      updatedUser.toObject();

    const response =
      NextResponse.json(
        {
          success: true,
          message:
            "OTP verified successfully. Login successful.",
          user: userResponse,
        },
        {
          status: 200,
        }
      );

    /*
     * Choose cookie lifetime based on
     * the Remember Me preference stored
     * in the OTP challenge.
     */
    const cookieMaxAge =
      rememberMe
        ? REMEMBER_ME_MAX_AGE
        : SESSION_MAX_AGE;

    /*
     * Secure authentication cookie.
     */
    response.cookies.set(
      "kotoze_access_token",
      token,
      {
        httpOnly: true,

        secure:
          process.env.NODE_ENV ===
          "production",

        sameSite: "lax",

        path: "/",

        maxAge:
          cookieMaxAge,
      }
    );

    return response;
  } catch (error: any) {
    console.error(
      "Verify OTP API:",
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
          error.statusCode ?? 400,
      }
    );
  }
}