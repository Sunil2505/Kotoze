import {
  AlertTriangle,
  Package,
  ShieldCheck,
  XCircle,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function InventoryHealth() {
  const total = 860;
  const inStock = 842;
  const lowStock = 12;
  const outOfStock = 6;

  const percentage = Math.round((inStock / total) * 100);

  return (
    <Card className="rounded-2xl border border-slate-200 shadow-sm transition-all duration-300 hover:shadow-lg">

      <CardHeader className="pb-4">

        <CardTitle className="text-lg font-bold text-slate-900">
          Inventory Health
        </CardTitle>

        <CardDescription>
          Current inventory availability
        </CardDescription>

      </CardHeader>

      <CardContent>

        {/* Health Score */}

        <div className="mb-8 rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-5">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-slate-500">
                Overall Health
              </p>

              <h2 className="mt-1 text-4xl font-bold text-slate-900">
                {percentage}%
              </h2>

            </div>

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100">

              <ShieldCheck className="h-7 w-7 text-emerald-700" />

            </div>

          </div>

          <div className="mt-5 h-3 overflow-hidden rounded-full bg-emerald-100">

            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-700"
              style={{ width: `${percentage}%` }}
            />

          </div>

        </div>

        {/* Stats */}

        <div className="space-y-4">

          <div className="flex items-center justify-between rounded-xl border border-slate-100 p-3">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">

                <Package className="h-5 w-5 text-emerald-700" />

              </div>

              <span className="text-sm font-medium text-slate-700">
                In Stock
              </span>

            </div>

            <span className="text-lg font-bold text-emerald-700">
              {inStock}
            </span>

          </div>

          <div className="flex items-center justify-between rounded-xl border border-slate-100 p-3">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100">

                <AlertTriangle className="h-5 w-5 text-amber-600" />

              </div>

              <span className="text-sm font-medium text-slate-700">
                Low Stock
              </span>

            </div>

            <span className="text-lg font-bold text-amber-600">
              {lowStock}
            </span>

          </div>

          <div className="flex items-center justify-between rounded-xl border border-slate-100 p-3">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100">

                <XCircle className="h-5 w-5 text-red-600" />

              </div>

              <span className="text-sm font-medium text-slate-700">
                Out of Stock
              </span>

            </div>

            <span className="text-lg font-bold text-red-600">
              {outOfStock}
            </span>

          </div>

        </div>

      </CardContent>

    </Card>
  );
}