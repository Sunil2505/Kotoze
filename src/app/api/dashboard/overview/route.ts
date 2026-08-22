import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import DashboardService from "@/services/DashboardService";
import { getAuthenticatedUser } from "@/lib/auth/authenticatedUser";
import { requireRole } from "@/lib/auth/authorization";

export async function GET(
  request: NextRequest
) {
  try {
    await connectDB();

    const user =
      await getAuthenticatedUser(request);

    requireRole(
      user.roleId.code,
      "SUPER_ADMIN"
    );

    const data =
      await DashboardService.getOverview();

    return NextResponse.json({
      success: true,
      message:
        "Dashboard overview fetched successfully.",
      data,
    });
  } catch (error: any) {
    console.error(
      "Dashboard Overview API:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error.message ??
          "Failed to fetch dashboard overview.",
      },
      {
        status: error.statusCode ?? 500,
      }
    );
  }
}