import AppError from "@/core/errors/AppError";

export type RoleCode =
  | "SUPER_ADMIN"
  | "ADMIN"   
  | "STAFF"
  | "VENDOR"
  | "CUSTOMER";

export function requireRole(
  roleCode: string,
  allowedRoles: RoleCode | RoleCode[]
) {
  const roles = Array.isArray(allowedRoles)
    ? allowedRoles
    : [allowedRoles];

  if (
    !roles.includes(
      roleCode as RoleCode
    )
  ) {
    throw new AppError(
      "You are not authorized to perform this action.",
      403
    );
  }
}

/**
 * Checks whether the current user
 * is allowed to manage the target user.
 *
 * Rules:
 *
 * SUPER_ADMIN:
 * - Can manage CUSTOMER, VENDOR, STAFF and ADMIN.
 * - Cannot manage another SUPER_ADMIN.
 * - Cannot manage itself.
 *
 * ADMIN:
 * - Can manage CUSTOMER, VENDOR and STAFF.
 * - Cannot manage ADMIN.
 * - Cannot manage SUPER_ADMIN.
 * - Cannot manage itself.
 */
export function requireUserManagementPermission(
  currentUserId: string,
  currentRoleCode: string,
  targetUserId: string,
  targetRoleCode: string
) {
  // Nobody can manage their own account
  // through User Management.
  if (
    currentUserId ===
    targetUserId
  ) {
    throw new AppError(
      "You cannot manage your own account from User Management.",
      403
    );
  }

  // SUPER_ADMIN can manage all
  // non-SUPER_ADMIN users.
  if (
    currentRoleCode ===
    "SUPER_ADMIN"
  ) {
    if (
      targetRoleCode ===
      "SUPER_ADMIN"
    ) {
      throw new AppError(
        "You are not authorized to manage a Super Admin account.",
        403
      );
    }

    return;
  }

  // ADMIN can manage only
  // STAFF, VENDOR and CUSTOMER.
  if (
    currentRoleCode ===
    "ADMIN"
  ) {
    const allowedTargetRoles:
      RoleCode[] = [
        "STAFF",
        "VENDOR",
        "CUSTOMER",
      ];

    if (
      !allowedTargetRoles.includes(
        targetRoleCode as RoleCode
      )
    ) {
      throw new AppError(
        "You are not authorized to manage this user.",
        403
      );
    }

    return;
  }

  throw new AppError(
    "You are not authorized to manage users.",
    403
  );
}

/**
 * Checks whether the current user
 * is allowed to create a user with
 * the requested role.
 *
 * SUPER_ADMIN:
 * - Can create ADMIN, STAFF, VENDOR and CUSTOMER.
 * - Cannot create SUPER_ADMIN.
 *
 * ADMIN:
 * - Can create STAFF, VENDOR and CUSTOMER.
 * - Cannot create ADMIN or SUPER_ADMIN.
 */
export function requireCreateUserPermission(
  currentRoleCode: string,
  targetRoleCode: string
) {
  if (
    currentRoleCode ===
    "SUPER_ADMIN"
  ) {
    if (
      targetRoleCode ===
      "SUPER_ADMIN"
    ) {
      throw new AppError(
        "You are not authorized to create a Super Admin account.",
        403
      );
    }

    return;
  }

  if (
    currentRoleCode ===
    "ADMIN"
  ) {
    const allowedTargetRoles:
      RoleCode[] = [
        "STAFF",
        "VENDOR",
        "CUSTOMER",
      ];

    if (
      !allowedTargetRoles.includes(
        targetRoleCode as RoleCode
      )
    ) {
      throw new AppError(
        "You are not authorized to create this user role.",
        403
      );
    }

    return;
  }

  throw new AppError(
    "You are not authorized to create users.",
    403
  );
}