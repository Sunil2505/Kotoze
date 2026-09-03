import "./bootstrap";

import bcrypt from "bcryptjs";

import { connectDB } from "@/lib/mongodb";

import User from "@/models/User";

import Role from "@/models/Role";

import { Status } from "@/types/common";

async function seedSuperAdmin() {
  await connectDB();

  const role =
    await Role.findOne({
      code: "SUPER_ADMIN",
    });

  if (!role) {
    throw new Error(
      "SUPER_ADMIN role not found."
    );
  }

  const existing =
    await User.findOne({
      mobile: "9999999999",
    });

  /*
   * Existing Super Admin
   * --------------------
   * Add username if it does not exist.
   */
  if (existing) {
    let updated = false;

    if (!existing.username) {
      existing.username =
        "superadmin";

      updated = true;
    }

    /*
     * Make sure the existing account
     * remains a Super Admin.
     */
    if (
      existing.roleId.toString() !==
      role._id.toString()
    ) {
      existing.roleId =
        role._id;

      updated = true;
    }

    /*
     * Make sure the account is active.
     */
    if (
      existing.status !==
      Status.ACTIVE
    ) {
      existing.status =
        Status.ACTIVE;

      updated = true;
    }

    if (updated) {
      await existing.save();

      console.log(
        "✅ Existing Super Admin updated."
      );
    } else {
      console.log(
        "✅ Super Admin already exists."
      );
    }

    return;
  }

  /*
   * Create Super Admin
   * ------------------
   */
  const passwordHash =
    await bcrypt.hash(
      "Admin@123",
      12
    );

  await User.create({
    roleId: role._id,

    username:
      "superadmin",

    firstName:
      "Super",

    lastName:
      "Admin",

    fullName:
      "Super Admin",

    mobile:
      "9999999999",

    passwordHash,

    isMobileVerified:
      true,

    isEmailVerified:
      true,

    status:
      Status.ACTIVE,
  });

  console.log(
    "✅ Super Admin created."
  );
}

seedSuperAdmin()
  .then(() =>
    process.exit(0)
  )
  .catch((error) => {
    console.error(
      "❌ Failed to seed Super Admin:",
      error
    );

    process.exit(1);
  });