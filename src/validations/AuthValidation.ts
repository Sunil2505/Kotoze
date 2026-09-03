import { z } from "zod";

export const LoginSchema = z.object({
  login: z
    .string()
    .trim()
    .min(
      3,
      "Username, mobile number or email is required"
    ),

  password: z
    .string()
    .min(
      6,
      "Password must be at least 6 characters"
    ),

  rememberMe: z
    .boolean()
    .default(false),
});

export type LoginInput =
  z.infer<typeof LoginSchema>;