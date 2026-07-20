import Link from "next/link";
import {
  FolderTree,
  Package,
  ShoppingCart,
  Store,
  UserPlus,
  Plus,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const actions = [
  {
    title: "Add Product",
    href: "/dashboard/products/new",
    icon: Package,
    color: "emerald",
  },
  {
    title: "New Order",
    href: "/dashboard/orders",
    icon: ShoppingCart,
    color: "blue",
  },
  {
    title: "Add Vendor",
    href: "/dashboard/vendors/new",
    icon: Store,
    color: "amber",
  },
  {
    title: "New Category",
    href: "/dashboard/categories/new",
    icon: FolderTree,
    color: "violet",
  },
  {
    title: "Add User",
    href: "/dashboard/users/new",
    icon: UserPlus,
    color: "rose",
  },
  {
    title: "More",
    href: "#",
    icon: Plus,
    color: "slate",
  },
];

function bg(color: string) {
  switch (color) {
    case "emerald":
      return "bg-emerald-100 text-emerald-700";
    case "blue":
      return "bg-sky-100 text-sky-700";
    case "amber":
      return "bg-amber-100 text-amber-700";
    case "violet":
      return "bg-violet-100 text-violet-700";
    case "rose":
      return "bg-rose-100 text-rose-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

export default function QuickActions() {
  return (
    <Card className="rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all">

      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>

      <CardContent>

        <div className="grid grid-cols-2 gap-3">

          {actions.map((action) => {
            const Icon = action.icon;

            return (
              <Link
                key={action.title}
                href={action.href}
                className="group rounded-xl border border-slate-200 bg-white p-4 transition-all hover:-translate-y-1 hover:border-emerald-200 hover:shadow-md"
              >
                <div
                  className={`mb-3 flex h-11 w-11 items-center justify-center rounded-xl ${bg(
                    action.color
                  )}`}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <p className="text-sm font-semibold text-slate-800">
                  {action.title}
                </p>
              </Link>
            );
          })}

        </div>

      </CardContent>

    </Card>
  );
}