import "./bootstrap";

import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

import { connectDB } from "@/lib/mongodb";
import Role from "@/models/Role";

async function restoreSuperAdminRole() {
  try {
    await connectDB();

    const role = await Role.findOneAndUpdate(
      {
        code: "SUPER_ADMIN",
      },
      {
        $set: {
          isActive: true,
          isSystem: true,
        },
      },
      {
        new: true,
      }
    );

    if (!role) {
      throw new Error(
        "SUPER_ADMIN role not found."
      );
    }

    console.log(
      "✅ SUPER_ADMIN role restored successfully."
    );

    console.log({
      id: role._id.toString(),
      name: role.name,
      code: role.code,
      isSystem: role.isSystem,
      isActive: role.isActive,
    });

    process.exit(0);
  } catch (error) {
    console.error(
      "❌ Failed to restore SUPER_ADMIN role:",
      error
    );

    process.exit(1);
  }
}

restoreSuperAdminRole();