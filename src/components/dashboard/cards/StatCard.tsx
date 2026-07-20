import { ArrowUpRight, LucideIcon } from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: string;
}

export default function StatCard({
  title,
  value,
  change,
  icon: Icon,
}: StatCardProps) {
  return (
    <Card className="group cursor-pointer border border-slate-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <CardContent className="flex items-start justify-between p-6">
        <div className="space-y-3">
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            {value}
          </h2>

          {change && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-600">
                <ArrowUpRight className="h-3 w-3" />
                {change}
              </div>

              <span className="text-xs text-slate-500">
                Compared to last month
              </span>
            </div>
          )}
        </div>

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 transition-all duration-300 group-hover:scale-110 group-hover:bg-emerald-100">
          <Icon className="h-7 w-7 text-emerald-600" />
        </div>
      </CardContent>
    </Card>
  );
}