import "./bootstrap";

import dotenv from "dotenv";
import bcrypt from "bcryptjs";

import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Role from "@/models/Role";
import { Status } from "@/types/common";

dotenv.config({
  path: ".env.local",
});

async function seedAdmin() {
  await connectDB();

  const username =
    process.env.ADMIN_USERNAME?.trim();

  const mobile =
    process.env.ADMIN_MOBILE?.trim();

  const password =
    process.env.ADMIN_PASSWORD;

  if (!username) {
    throw new Error(
      "ADMIN_USERNAME is not defined."
    );
  }

  if (!mobile) {
    throw new Error(
      "ADMIN_MOBILE is not defined."
    );
  }

  if (!password) {
    throw new Error(
      "ADMIN_PASSWORD is not defined."
    );
  }

  const role =
    await Role.findOne({
      code: "ADMIN",
      isActive: true,
    });

  if (!role) {
    throw new Error(
      "ADMIN role not found."
    );
  }

  const existingByUsername =
    await User.findOne({
      username:
        username.toLowerCase(),
    });

  if (existingByUsername) {
    console.log(
      "✅ Admin already exists."
    );
    return;
  }

  const existingByMobile =
    await User.findOne({
      mobile,
    });

  if (existingByMobile) {
    throw new Error(
      "The configured Admin mobile number is already in use."
    );
  }

  const passwordHash =
    await bcrypt.hash(
      password,
      12
    );

  await User.create({
    roleId: role._id,

    username:
      username.toLowerCase(),

    firstName: "Admin",

    lastName: "User",

    fullName: "Admin User",

    mobile,

    passwordHash,

    isMobileVerified: false,

    isEmailVerified: false,

    status:
      Status.ACTIVE,
  });

  console.log(
    "✅ Admin created successfully."
  );
}

seedAdmin()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error(
      "❌ Failed to seed Admin:",
      error
    );

    process.exit(1);
  });