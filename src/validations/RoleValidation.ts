import { z } from "zod";

export const createRoleSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Role name is required")
    .max(100),

  code: z
    .string()
    .trim()
    .min(2, "Role code is required")
    .max(50)
    .regex(
      /^[A-Za-z0-9_]+$/,
      "Role code can only contain letters, numbers, and underscores"
    ),

  description: z
    .string()
    .trim()
    .max(500)
    .optional()
    .or(z.literal("")),

  isSystem: z
    .boolean()
    .optional()
    .default(false),

  isActive: z
    .boolean()
    .optional()
    .default(true),
});

export const updateRoleSchema =
  createRoleSchema.partial();

export type CreateRoleInput =
  z.infer<typeof createRoleSchema>;

export type UpdateRoleInput =
  z.infer<typeof updateRoleSchema>;