import "./bootstrap";

import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

import { connectDB } from "@/lib/mongodb";
import Role from "@/models/Role";

const roles = [
  {
    name: "Super Admin",
    code: "SUPER_ADMIN",
    description: "Full system access",
    isSystem: true,
    isActive: true,
  },
  {
    name: "Admin",
    code: "ADMIN",
    description: "Administrative user",
    isSystem: true,
    isActive: true,
  },
  {
    name: "Vendor",
    code: "VENDOR",
    description: "Vendor account",
    isSystem: true,
    isActive: true,
  },
  {
    name: "Staff",
    code: "STAFF",
    description: "Staff account",
    isSystem: true,
    isActive: true,
  },
  {
    name: "Customer",
    code: "CUSTOMER",
    description: "Customer account",
    isSystem: true,
    isActive: true,
  },
];

async function seedRoles() {
  try {
    await connectDB();

    for (const role of roles) {
      await Role.updateOne(
        { code: role.code },
        { $setOnInsert: role },
        { upsert: true }
      );
    }

    console.log("✅ Roles seeded successfully.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Failed to seed roles:", error);
    process.exit(1);
  }
}

seedRoles();