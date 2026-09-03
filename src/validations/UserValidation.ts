import { z } from "zod";
import { Status } from "@/types/common";

const usernameSchema = z
  .string()
  .trim()
  .min(
    3,
    "Username must be at least 3 characters"
  )
  .max(
    30,
    "Username must be at most 30 characters"
  )
  .regex(
    /^[a-zA-Z0-9._-]+$/,
    "Username can contain only letters, numbers, dot, underscore and hyphen"
  );

export const createUserSchema = z.object({
  roleId: z
    .string()
    .trim()
    .min(
      1,
      "Role is required"
    ),

  username:
    usernameSchema,

  vendorId: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")),

  firstName: z
    .string()
    .trim()
    .min(
      2,
      "First name is required"
    )
    .max(50),

  lastName: z
    .string()
    .trim()
    .min(
      1,
      "Last name is required"
    )
    .max(50),

  email: z
    .string()
    .trim()
    .email("Invalid email"),

  mobile: z
    .string()
    .trim()
    .min(
      10,
      "Invalid mobile number"
    )
    .max(15),

  password: z
    .string()
    .min(
      6,
      "Password must be at least 6 characters"
    ),

  status: z
    .nativeEnum(Status)
    .optional()
    .default(Status.ACTIVE),
});

export const updateUserSchema =
  createUserSchema
    .omit({
      password: true,
    })
    .partial();

export type CreateUserInput =
  z.infer<typeof createUserSchema>;

export type UpdateUserInput =
  z.infer<typeof updateUserSchema>;