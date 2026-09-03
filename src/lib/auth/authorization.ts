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

  if (!roles.includes(roleCode as RoleCode)) {
    throw new AppError(
      "You are not authorized to perform this action.",
      403
    );
  }
}