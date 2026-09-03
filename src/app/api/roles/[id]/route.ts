import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import RoleService from "@/services/RoleService";
import { updateRoleSchema } from "@/validations/RoleValidation";
import { getAuthenticatedUser } from "@/lib/auth/authenticatedUser";
import { requireRole } from "@/lib/auth/authorization";

const roleService = new RoleService();

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

    const role =
      await roleService.getById(id);

    return NextResponse.json({
      success: true,
      message:
        "Role fetched successfully.",
      data: role,
    });
  } catch (error: any) {
    console.error(
      "Role GET API:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error.message ??
          "Failed to fetch role.",
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
      updateRoleSchema.safeParse(
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

    if (result.data.code) {
      const existingRole =
        await roleService.findByCode(
          result.data.code
        );

      if (
        existingRole &&
        existingRole._id.toString() !== id
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Role code already exists.",
          },
          {
            status: 409,
          }
        );
      }
    }

    const updatedRole =
      await roleService.updateRole(
        id,
        {
          ...result.data,
          code: result.data.code
            ? result.data.code.toUpperCase()
            : undefined,
        }
      );

    return NextResponse.json({
      success: true,
      message:
        "Role updated successfully.",
      data: updatedRole,
    });
  } catch (error: any) {
    console.error(
      "Role PUT API:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error.message ??
          "Failed to update role.",
      },
      {
        status:
          error.statusCode ?? 400,
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

    await roleService.deleteRole(id);

    return NextResponse.json({
      success: true,
      message:
        "Role deleted successfully.",
    });
  } catch (error: any) {
    console.error(
      "Role DELETE API:",
      error
    );

    const status =
      error.message ===
      "System roles cannot be deleted."
        ? 403
        : error.message ===
            "Role not found."
          ? 404
          : error.statusCode ?? 400;

    return NextResponse.json(
      {
        success: false,
        message:
          error.message ??
          "Failed to delete role.",
      },
      {
        status,
      }
    );
  }
}