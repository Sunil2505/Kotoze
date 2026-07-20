import {
  BadgeCheck,
  Package,
  ShoppingCart,
  UserPlus,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const activities = [
  {
    icon: ShoppingCart,
    title: "New order received",
    description: "Order #ORD-1024 placed by Rahul Kumar",
    time: "5 min ago",
    color: "emerald",
  },
  {
    icon: UserPlus,
    title: "New customer registered",
    description: "Anjali Thomas created an account",
    time: "18 min ago",
    color: "blue",
  },
  {
    icon: Package,
    title: "Product added",
    description: "Apple AirPods Pro added to inventory",
    time: "1 hour ago",
    color: "amber",
  },
  {
    icon: BadgeCheck,
    title: "Vendor approved",
    description: "TechWorld Suppliers verified successfully",
    time: "2 hours ago",
    color: "violet",
  },
];

function iconColor(color: string) {
  switch (color) {
    case "emerald":
      return "bg-emerald-100 text-emerald-700";

    case "blue":
      return "bg-sky-100 text-sky-700";

    case "amber":
      return "bg-amber-100 text-amber-700";

    default:
      return "bg-violet-100 text-violet-700";
  }
}

export default function RecentActivity() {
  return (
    <Card className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm transition-all duration-300 hover:shadow-xl">

      <CardHeader className="border-b border-slate-100">

        <CardTitle className="text-lg font-bold tracking-tight text-slate-900">
          Recent Activity
        </CardTitle>

      </CardHeader>

      <CardContent className="p-6">

        <div className="space-y-6">

          {activities.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="relative flex gap-4"
              >
                <div className="relative flex w-11 justify-center">

                  <div
                    className={`relative z-10 flex h-11 w-11 items-center justify-center rounded-xl shadow-sm ${iconColor(
                      item.color
                    )}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  {index !== activities.length - 1 && (
                    <div className="absolute left-1/2 top-11 bottom-0 w-px -translate-x-1/2 bg-slate-200" />
                  )}
                </div>

                <div className="flex-1 pb-6">
                                  <div className="flex items-start justify-between gap-3">

                    <div>

                      <h4 className="font-semibold text-slate-900">
                        {item.title}
                      </h4>

                      <p className="mt-1 text-sm leading-6 text-slate-500">
                        {item.description}
                      </p>

                    </div>

                    <span className="whitespace-nowrap rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-500">
                      {item.time}
                    </span>

                  </div>

                </div>

              </div>
            );
          })}

        </div>

      </CardContent>

    </Card>
  );
}