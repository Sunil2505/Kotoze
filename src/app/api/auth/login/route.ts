import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import AuthService from "@/services/AuthService";
import { LoginSchema } from "@/validations/AuthValidation";

const authService = new AuthService();

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    const result = LoginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed.",
          errors: result.error.flatten(),
        },
        {
          status: 400,
        }
      );
    }

    const { login, password } = result.data;

    const { token, user } = await authService.login(
      login,
      password
    );

    const response = NextResponse.json(
      {
        success: true,
        message: "Login successful.",
        user,
      },
      {
        status: 200,
      }
    );

    response.cookies.set("kotoze_access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 15, // 15 minutes
    });

    console.log("================================");
    console.log(
      "Set-Cookie:",
      response.headers.get("set-cookie")
    );

    return response;
  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: error.message ?? "Login failed.",
      },
      {
        status: error.statusCode ?? 500,
      }
    );
  }
}