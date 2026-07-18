import {
  DollarSign,
  Package,
  ShoppingCart,
  Users,
} from "lucide-react";

import StatCard from "@/components/dashboard/cards/StatCard";
import SalesOverview from "@/components/dashboard/charts/SalesOverview";
import RecentOrders from "@/components/dashboard/tables/RecentOrders";

export default function DashboardPage() {
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

      {/* Statistics */}
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Revenue"
          value="₹2,45,300"
          change="+12.4% this month"
          icon={DollarSign}
        />

        <StatCard
          title="Orders"
          value="1,245"
          change="+8.1% this month"
          icon={ShoppingCart}
        />

        <StatCard
          title="Products"
          value="865"
          change="+15.3% this month"
          icon={Package}
        />

        <StatCard
          title="Users"
          value="4,520"
          change="+6.2% this month"
          icon={Users}
        />
      </div>

      {/* Chart + Summary */}
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <SalesOverview />
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold">
            Quick Summary
          </h3>

          <div className="mt-6 space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">
                Pending Orders
              </span>
              <span className="font-semibold">
                58
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">
                Low Stock Products
              </span>
              <span className="font-semibold text-red-500">
                12
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">
                New Users
              </span>
              <span className="font-semibold text-emerald-600">
                +34
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">
                Active Vendors
              </span>
              <span className="font-semibold">
                26
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">
                Completed Orders
              </span>
              <span className="font-semibold text-emerald-600">
                1,187
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">
                Cancelled Orders
              </span>
              <span className="font-semibold text-red-500">
                18
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <RecentOrders />
    </div>
  );
}