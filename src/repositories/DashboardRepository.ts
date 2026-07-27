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
      User.countDocuments({ isDeleted: false }),
      Vendor.countDocuments({ isDeleted: false }),
      Product.countDocuments({ isDeleted: false }),
      Category.countDocuments({ isDeleted: false }),
      Brand.countDocuments({ isDeleted: false }),
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
    const users = await User.find({
      isDeleted: false,
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select("_id fullName email createdAt")
      .lean();

    return users.map((user: any) => ({
      _id: String(user._id),
      name: user.fullName,
      email: user.email,
      createdAt: user.createdAt,
    }));
  }

  static async getRecentProducts(limit = 5) {
    const products = await Product.find({
      isDeleted: false,
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select("_id name sku createdAt")
      .lean();

    return products.map((product: any) => ({
      _id: String(product._id),
      name: product.name,
      sku: product.sku,
      stock: 0,
      createdAt: product.createdAt,
    }));
  }

  static async getDashboardOverview() {
    const [
      summary,
      inventory,
      recentUsers,
      recentProducts,
    ] = await Promise.all([
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