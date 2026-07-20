export interface DashboardSummary {
  totalUsers: number;
  totalVendors: number;
  totalProducts: number;
  totalCategories: number;
  totalBrands: number;
}

export interface InventorySummary {
  lowStock: number;
  outOfStock: number;
}

export interface RecentUser {
  _id: string;
  name: string;
  email: string;
  createdAt: Date;
}

export interface RecentProduct {
  _id: string;
  name: string;
  sku: string;
  stock: number;
  createdAt: Date;
}

export interface DashboardOverview {
  summary: DashboardSummary;
  inventory: InventorySummary;
  recent: {
    users: RecentUser[];
    products: RecentProduct[];
  };
}