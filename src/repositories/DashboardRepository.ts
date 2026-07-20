import User from "@/models/User";
import Vendor from "@/models/Vendor";
import Product from "@/models/Product";
import Category from "@/models/Category";
import Brand from "@/models/Brand";
import Inventory from "@/models/Inventory";

export default class DashboardRepository {
  static async getSummary() {
    const [
      totalUsers,
      totalVendors,
      totalProducts,
      totalCategories,
      totalBrands,
    ] = await Promise.all([
      User.countDocuments(),
      Vendor.countDocuments(),
      Product.countDocuments(),
      Category.countDocuments(),
      Brand.countDocuments(),
    ]);

    return {
      totalUsers,
      totalVendors,
      totalProducts,
      totalCategories,
      totalBrands,
    };
  }

  static async getInventorySummary() {
    const [lowStock, outOfStock] = await Promise.all([
      Inventory.countDocuments({
        $expr: {
          $and: [
            { $gt: ["$availableStock", 0] },
            { $lte: ["$availableStock", "$reorderLevel"] },
          ],
        },
      }),
      Inventory.countDocuments({
        availableStock: 0,
      }),
    ]);

    return {
      lowStock,
      outOfStock,
    };
  }

  static async getRecentUsers(limit = 5) {
    return User.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .select("fullName email mobile createdAt")
      .lean();
  }

  static async getRecentProducts(limit = 5) {
    return Product.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .select("name sku createdAt")
      .lean();
  }

  static async getDashboardOverview() {
    const [summary, inventory, recentUsers, recentProducts] =
      await Promise.all([
        this.getSummary(),
        this.getInventorySummary(),
        this.getRecentUsers(),
        this.getRecentProducts(),
      ]);

    return {
      summary,
      inventory,
      recent: {
        users: recentUsers,
        products: recentProducts,
      },
    };
  }
}