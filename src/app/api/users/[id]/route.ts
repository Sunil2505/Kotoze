import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import UserService from "@/services/UserService";
import { updateUserSchema } from "@/validations/UserValidation";
import { getAuthenticatedUser } from "@/lib/auth/authenticatedUser";
import { requireRole } from "@/lib/auth/authorization";

const userService = new UserService();

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    await connectDB();

    const user =
      await getAuthenticatedUser(request);

    requireRole(
      user.roleId.code,
      ["SUPER_ADMIN", "ADMIN"]
    );

    const { id } =
      await context.params;

    const targetUser =
      await userService.getById(id);

    return NextResponse.json({
      success: true,
      message:
        "User fetched successfully.",
      data: targetUser,
    });
  } catch (error: any) {
    console.error(
      "User GET API:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error.message ??
          "Failed to fetch user.",
      },
      {
        status:
          error.statusCode ?? 500,
      }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    await connectDB();

    const user =
      await getAuthenticatedUser(request);

    requireRole(
      user.roleId.code,
      ["SUPER_ADMIN", "ADMIN"]
    );

    const { id } =
      await context.params;

    const body =
      await request.json();

    const result =
      updateUserSchema.safeParse(
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

    const updatedUser =
      await userService.updateUser(
        id,
        result.data
      );

    return NextResponse.json({
      success: true,
      message:
        "User updated successfully.",
      data: updatedUser,
    });
  } catch (error: any) {
    console.error(
      "User PUT API:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error.message ??
          "Failed to update user.",
      },
      {
        status:
          error.statusCode ?? 500,
      }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    await connectDB();

    const user =
      await getAuthenticatedUser(request);

    requireRole(
      user.roleId.code,
      ["SUPER_ADMIN", "ADMIN"]
    );

    const { id } =
      await context.params;

    await userService.deleteUser(id);

    return NextResponse.json({
      success: true,
      message:
        "User deleted successfully.",
    });
  } catch (error: any) {
    console.error(
      "User DELETE API:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error.message ??
          "Failed to delete user.",
      },
      {
        status:
          error.statusCode ?? 500,
      }
    );
  }
}