import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import UserService from "@/services/UserService";
import { createUserSchema } from "@/validations/UserValidation";
import { getAuthenticatedUser } from "@/lib/auth/authenticatedUser";
import { requireRole } from "@/lib/auth/authorization";

const userService = new UserService();

export async function GET(
  request: NextRequest
) {
  try {
    await connectDB();

    const user =
      await getAuthenticatedUser(request);

    requireRole(
      user.roleId.code,
      ["SUPER_ADMIN", "ADMIN"]
    );

    const users =
      await userService.getAll();

    return NextResponse.json({
      success: true,
      message:
        "Users fetched successfully.",
      data: users,
    });
  } catch (error: any) {
    console.error(
      "Users GET API:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error.message ??
          "Failed to fetch users.",
      },
      {
        status:
          error.statusCode ?? 500,
      }
    );
  }
}

export async function POST(
  request: NextRequest
) {
  try {
    await connectDB();

    const user =
      await getAuthenticatedUser(request);

    requireRole(
      user.roleId.code,
      ["SUPER_ADMIN", "ADMIN"]
    );

    const body =
      await request.json();

    const result =
      createUserSchema.safeParse(
        body
      );

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

    const createdUser =
      await userService.createUser(
        result.data
      );

    return NextResponse.json(
      {
        success: true,
        message:
          "User created successfully.",
        data: createdUser,
      },
      {
        status: 201,
      }
    );
  } catch (error: any) {
    console.error(
      "Users POST API:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error.message ??
          "Failed to create user.",
      },
      {
        status:
          error.statusCode ?? 500,
      }
    );
  }
}