import {
  LayoutDashboard,
  Users,
  Shield,
  Building2,
  FolderTree,
  BadgePercent,
  Package,
  Boxes,
  ShoppingCart,
  BarChart3,
  Settings,
  Megaphone,
} from "lucide-react";

import { SidebarItem } from "@/types/sidebar";

export const sidebarItems: SidebarItem[] = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },

  {
    title: "Masters",
    icon: Users,
    children: [
      {
        title: "Users",
        icon: Users,
        href: "/dashboard/users",
      },
      {
        title: "Roles",
        icon: Shield,
        href: "/dashboard/roles",
      },
      {
        title: "Vendors",
        icon: Building2,
        href: "/dashboard/vendors",
      },
    ],
  },

  {
    title: "Catalog",
    icon: FolderTree,
    children: [
      {
        title: "Categories",
        icon: FolderTree,
        href: "/dashboard/categories",
      },
      {
        title: "Brands",
        icon: BadgePercent,
        href: "/dashboard/brands",
      },
      {
        title: "Products",
        icon: Package,
        href: "/dashboard/products",
      },
    ],
  },

  {
    title: "Inventory",
    icon: Boxes,
    href: "/dashboard/inventory",
  },

  {
    title: "Orders",
    icon: ShoppingCart,
    href: "/dashboard/orders",
  },

  {
    title: "Marketing",
    icon: Megaphone,
    href: "/dashboard/marketing",
  },

  {
    title: "Reports",
    icon: BarChart3,
    href: "/dashboard/reports",
  },

  {
    title: "Settings",
    icon: Settings,
    href: "/dashboard/settings",
  },
];