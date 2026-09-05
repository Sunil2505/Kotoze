import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import UserService from "@/services/UserService";
import Role from "@/models/Role";
import { updateUserSchema } from "@/validations/UserValidation";
import { getAuthenticatedUser } from "@/lib/auth/authenticatedUser";
import {
  requireRole,
  requireUserManagementPermission,
} from "@/lib/auth/authorization";

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

    const targetRole =
      await Role.findById(
        targetUser.roleId
      );

    if (!targetRole) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Target user's role could not be found.",
        },
        {
          status: 400,
        }
      );
    }

    console.log("USER MANAGEMENT DEBUG:", {
  currentUserId:
    user._id.toString(),

  currentRole:
    user.roleId.code,

  targetUserId:
    targetUser._id.toString(),

  targetRoleId:
    targetUser.roleId?.toString(),

  targetRole:
    targetRole?.code,
});

    requireUserManagementPermission(
      user._id.toString(),
      user.roleId.code,
      targetUser._id.toString(),
      targetRole.code
    );

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

    /*
     * Load the existing target user
     * before processing the update.
     */
    const targetUser =
      await userService.getById(id);

    /*
     * Resolve the target user's role
     * from the Role collection.
     */
    const targetRole =
      await Role.findById(
        targetUser.roleId
      );

    if (!targetRole) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Target user's role could not be found.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * Check whether the current user
     * is allowed to manage the
     * existing target user.
     */
    requireUserManagementPermission(
      user._id.toString(),
      user.roleId.code,
      targetUser._id.toString(),
      targetRole.code
    );

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

    /*
     * If roleId is being changed,
     * validate the new role and
     * check whether the current
     * user can assign it.
     */
    if (result.data.roleId) {
      const newRole =
        await Role.findOne({
          _id:
            result.data.roleId,
          isActive: true,
        });

      if (!newRole) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Invalid or inactive role.",
          },
          {
            status: 400,
          }
        );
      }

      /*
       * ADMIN can only assign:
       * STAFF, VENDOR or CUSTOMER.
       */
      if (
        user.roleId.code ===
        "ADMIN"
      ) {
        const allowedRoles = [
          "STAFF",
          "VENDOR",
          "CUSTOMER",
        ];

        if (
          !allowedRoles.includes(
            newRole.code
          )
        ) {
          return NextResponse.json(
            {
              success: false,
              message:
                "You are not authorized to assign this role.",
            },
            {
              status: 403,
            }
          );
        }
      }

      /*
       * SUPER_ADMIN cannot assign
       * SUPER_ADMIN through User
       * Management.
       */
      if (
        user.roleId.code ===
          "SUPER_ADMIN" &&
        newRole.code ===
          "SUPER_ADMIN"
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "You are not authorized to assign the Super Admin role.",
          },
          {
            status: 403,
          }
        );
      }
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

    const targetUser =
      await userService.getById(id);

    /*
     * Resolve the target user's role
     * from the Role collection.
     */
    const targetRole =
      await Role.findById(
        targetUser.roleId
      );

    if (!targetRole) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Target user's role could not be found.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * Check whether the current user
     * is allowed to delete the
     * target user.
     */
    requireUserManagementPermission(
      user._id.toString(),
      user.roleId.code,
      targetUser._id.toString(),
      targetRole.code
    );

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