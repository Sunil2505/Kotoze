import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import RoleService from "@/services/RoleService";
import { createRoleSchema } from "@/validations/RoleValidation";
import { getAuthenticatedUser } from "@/lib/auth/authenticatedUser";
import { requireRole } from "@/lib/auth/authorization";

const roleService = new RoleService();

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

    const roles =
      await roleService.getAll();

    return NextResponse.json({
      success: true,
      message:
        "Roles fetched successfully.",
      data: roles,
    });
  } catch (error: any) {
    console.error(
      "Roles GET API:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error.message ??
          "Failed to fetch roles.",
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
      createRoleSchema.safeParse(
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

    const existingRole =
      await roleService.findByCode(
        result.data.code
      );

    if (existingRole) {
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

    const role =
      await roleService.create({
        ...result.data,
        code:
          result.data.code.toUpperCase(),
      });

    return NextResponse.json(
      {
        success: true,
        message:
          "Role created successfully.",
        data: role,
      },
      {
        status: 201,
      }
    );
  } catch (error: any) {
    console.error(
      "Roles POST API:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error.message ??
          "Failed to create role.",
      },
      {
        status:
          error.statusCode ?? 400,
      }
    );
  }
}