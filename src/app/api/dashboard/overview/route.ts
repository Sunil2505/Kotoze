import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import DashboardService from "@/services/DashboardService";

export async function GET() {
  try {
    await connectDB();

    const data = await DashboardService.getOverview();

    return NextResponse.json({
      success: true,
      message: "Dashboard overview fetched successfully.",
      data,
    });
  } catch (error) {
    console.error("Dashboard Overview API:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch dashboard overview.",
      },
      {
        status: 500,
      }
    );
  }
}