import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(process.cwd(), ".env.local"),
});

import Category from "@/models/Category";
import Brand from "@/models/Brand";
import Vendor, { VendorApprovalStatus } from "@/models/Vendor";
import { Status } from "@/types/common";

async function seedMasterData() {
  try {
    // Load MongoDB only after dotenv
    const { connectDB } = await import("@/lib/mongodb");

    await connectDB();

    console.log("✅ MongoDB Connected");

    await Category.deleteMany({});
    await Brand.deleteMany({});
    await Vendor.deleteMany({});

    console.log("🗑 Existing master data cleared");

    // ==========================
    // Categories
    // ==========================

    await Category.insertMany([
      {
        name: "Electronics",
        slug: "electronics",
        description: "Electronic Products",
        parentId: null,
        image: "",
        sortOrder: 1,
        status: Status.ACTIVE,
      },
      {
        name: "Fashion",
        slug: "fashion",
        description: "Fashion Products",
        parentId: null,
        image: "",
        sortOrder: 2,
        status: Status.ACTIVE,
      },
      {
        name: "Home & Kitchen",
        slug: "home-kitchen",
        description: "Home & Kitchen Products",
        parentId: null,
        image: "",
        sortOrder: 3,
        status: Status.ACTIVE,
      },
      {
        name: "Groceries",
        slug: "groceries",
        description: "Groceries",
        parentId: null,
        image: "",
        sortOrder: 4,
        status: Status.ACTIVE,
      },
      {
        name: "Mobiles",
        slug: "mobiles",
        description: "Mobile Phones",
        parentId: null,
        image: "",
        sortOrder: 5,
        status: Status.ACTIVE,
      },
    ]);

    console.log("✅ Categories Seeded");

    // ==========================
    // Brands
    // ==========================

    await Brand.insertMany([
      {
        name: "Samsung",
        slug: "samsung",
        description: "Samsung Electronics",
        logo: "",
        website: "https://www.samsung.com",
        sortOrder: 1,
        status: Status.ACTIVE,
      },
      {
        name: "Apple",
        slug: "apple",
        description: "Apple Inc.",
        logo: "",
        website: "https://www.apple.com",
        sortOrder: 2,
        status: Status.ACTIVE,
      },
      {
        name: "Sony",
        slug: "sony",
        description: "Sony",
        logo: "",
        website: "https://www.sony.com",
        sortOrder: 3,
        status: Status.ACTIVE,
      },
      {
        name: "LG",
        slug: "lg",
        description: "LG",
        logo: "",
        website: "https://www.lg.com",
        sortOrder: 4,
        status: Status.ACTIVE,
      },
      {
        name: "HP",
        slug: "hp",
        description: "HP",
        logo: "",
        website: "https://www.hp.com",
        sortOrder: 5,
        status: Status.ACTIVE,
      },
    ]);

    console.log("✅ Brands Seeded");

    // ==========================
    // Vendors
    // ==========================

    await Vendor.insertMany([
      {
        vendorCode: "VEN001",
        businessName: "ABC Distributors",
        legalName: "ABC Distributors Pvt Ltd",
        contactPerson: "Sunil",
        email: "vendor1@kotoze.com",
        mobile: "9876543210",
        gstNumber: "",
        panNumber: "",
        status: Status.ACTIVE,
        approvalStatus: VendorApprovalStatus.APPROVED,
      },
      {
        vendorCode: "VEN002",
        businessName: "Tech World",
        legalName: "Tech World Pvt Ltd",
        contactPerson: "Arun",
        email: "vendor2@kotoze.com",
        mobile: "9876543211",
        gstNumber: "",
        panNumber: "",
        status: Status.ACTIVE,
        approvalStatus: VendorApprovalStatus.APPROVED,
      },
      {
        vendorCode: "VEN003",
        businessName: "Kerala Electronics",
        legalName: "Kerala Electronics",
        contactPerson: "Rahul",
        email: "vendor3@kotoze.com",
        mobile: "9876543212",
        gstNumber: "",
        panNumber: "",
        status: Status.ACTIVE,
        approvalStatus: VendorApprovalStatus.APPROVED,
      },
    ]);

    console.log("✅ Vendors Seeded");

    console.log("\n🎉 Master Data Seeded Successfully.");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seed Failed");
    console.error(error);
    process.exit(1);
  }
}

seedMasterData();