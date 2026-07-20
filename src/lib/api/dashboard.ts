export interface DashboardOverviewResponse {
  success: boolean;
  message: string;
  data: {
    summary: {
      totalUsers: number;
      totalVendors: number;
      totalProducts: number;
      totalCategories: number;
      totalBrands: number;
    };
    inventory: {
      lowStock: number;
      outOfStock: number;
    };
    recent: {
      users: Array<{
        _id: string;
        fullName: string;
        email?: string;
        mobile: string;
        createdAt: string;
      }>;
      products: Array<{
        _id: string;
        name: string;
        sku: string;
        createdAt: string;
      }>;
    };
  };
}

export async function getDashboardOverview(): Promise<DashboardOverviewResponse> {
  const response = await fetch("/api/dashboard/overview", {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch dashboard overview.");
  }

  return response.json();
}