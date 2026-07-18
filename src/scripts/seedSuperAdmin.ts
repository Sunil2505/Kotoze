import "./bootstrap";

import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Role from "@/models/Role";
import { Status } from "@/types/common";

async function seedSuperAdmin() {
  await connectDB();

  const role = await Role.findOne({ code: "SUPER_ADMIN" });

  if (!role) {
    throw new Error("SUPER_ADMIN role not found.");
  }

  const existing = await User.findOne({
    mobile: "9999999999",
  });

  if (existing) {
    console.log("✅ Super Admin already exists.");
    return;
  }

  const passwordHash = await bcrypt.hash("Admin@123", 12);

  await User.create({
    roleId: role._id,
    firstName: "Super",
    lastName: "Admin",
    fullName: "Super Admin",
    mobile: "9999999999",
    passwordHash,
    isMobileVerified: true,
    isEmailVerified: true,
    status: Status.ACTIVE,
  });

  console.log("✅ Super Admin created.");
}

seedSuperAdmin()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });