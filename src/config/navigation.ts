import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Store,
  FolderTree,
  Tags,
  Package,
  Boxes,
  ShoppingCart,
  BarChart3,
  Settings,
} from "lucide-react";

export const navigation = [
  {
    title: "GENERAL",
    items: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },

  {
    title: "MANAGEMENT",
    items: [
      {
        label: "Users",
        href: "/dashboard/users",
        icon: Users,
      },
      {
        label: "Roles",
        href: "/dashboard/roles",
        icon: ShieldCheck,
      },
      {
        label: "Vendors",
        href: "/dashboard/vendors",
        icon: Store,
      },
    ],
  },

  {
    title: "CATALOG",
    items: [
      {
        label: "Categories",
        href: "/dashboard/categories",
        icon: FolderTree,
      },
      {
        label: "Brands",
        href: "/dashboard/brands",
        icon: Tags,
      },
      {
        label: "Products",
        href: "/dashboard/products",
        icon: Package,
      },
      {
        label: "Inventory",
        href: "/dashboard/inventory",
        icon: Boxes,
      },
    ],
  },

  {
    title: "SALES",
    items: [
      {
        label: "Orders",
        href: "/dashboard/orders",
        icon: ShoppingCart,
      },
    ],
  },

  {
    title: "REPORTS",
    items: [
      {
        label: "Reports",
        href: "/dashboard/reports",
        icon: BarChart3,
      },
    ],
  },

  {
    title: "SETTINGS",
    items: [
      {
        label: "Settings",
        href: "/dashboard/settings",
        icon: Settings,
      },
    ],
  },
];