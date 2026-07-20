"use client";

import { useEffect, useState } from "react";
import {
  DollarSign,
  Package,
  ShoppingCart,
  Users,
} from "lucide-react";

import StatCard from "@/components/dashboard/cards/StatCard";
import SalesOverview from "@/components/dashboard/charts/SalesOverview";
import RecentOrders from "@/components/dashboard/tables/RecentOrders";
import RecentUsers from "@/components/dashboard/widgets/RecentUsers";

import { getDashboardOverview } from "@/lib/api/dashboard";

interface DashboardData {
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
}

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const response = await getDashboardOverview();
        setDashboard(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-muted-foreground">
          Loading dashboard...
        </p>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-red-500">
          Failed to load dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">
          Dashboard
        </h1>

        <p className="mt-1 text-muted-foreground">
          Welcome back, Super Admin.
        </p>
      </div>

      {/* Live Statistics */}
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Users"
          value={dashboard.summary.totalUsers}
          icon={Users}
        />

        <StatCard
          title="Vendors"
          value={dashboard.summary.totalVendors}
          icon={ShoppingCart}
        />

        <StatCard
          title="Products"
          value={dashboard.summary.totalProducts}
          icon={Package}
        />

        <StatCard
          title="Categories"
          value={dashboard.summary.totalCategories}
          icon={DollarSign}
        />
      </div>

      {/* Existing Section */}
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <SalesOverview />
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold">
            Inventory Summary
          </h3>

          <div className="mt-6 space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">
                Low Stock
              </span>

              <span className="font-semibold text-orange-500">
                {dashboard.inventory.lowStock}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">
                Out of Stock
              </span>

              <span className="font-semibold text-red-500">
                {dashboard.inventory.outOfStock}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">
                Brands
              </span>

              <span className="font-semibold">
                {dashboard.summary.totalBrands}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <RecentUsers
          users={dashboard.recent.users}
        />

        <RecentOrders />
      </div>
    </div>
  );
}