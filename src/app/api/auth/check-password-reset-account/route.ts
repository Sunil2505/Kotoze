import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import UserRepository from "@/repositories/UserRepository";

const userRepository =
  new UserRepository();

export async function POST(
  request: NextRequest
) {
  try {
    await connectDB();

    const body =
      await request.json();

    const login =
      typeof body.login === "string"
        ? body.login.trim()
        : "";

    if (!login) {
      return NextResponse.json(
        {
          valid: false,
        },
        {
          status: 200,
        }
      );
    }

    const user =
      await userRepository.findByMobileOrEmail(
        login
      );

    const valid = Boolean(
      user &&
        !user.isDeleted &&
        user.status === "ACTIVE" &&
        user.mobile?.trim()
    );

    return NextResponse.json(
      {
        valid,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "Check Password Reset Account API:",
      error
    );

    /*
     * Always return false rather than exposing
     * account information.
     */
    return NextResponse.json(
      {
        valid: false,
      },
      {
        status: 200,
      }
    );
  }
}