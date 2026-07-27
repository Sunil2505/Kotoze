import { z } from "zod";
import { Status } from "@/types/common";

export const createProductSchema = z.object({
  vendorId: z
    .string()
    .trim()
    .min(1, "Vendor is required"),

  categoryId: z
    .string()
    .trim()
    .min(1, "Category is required"),

  brandId: z
    .string()
    .trim()
    .min(1, "Brand is required"),

  name: z
    .string()
    .trim()
    .min(2, "Product name is required")
    .max(200),

  shortDescription: z
    .string()
    .trim()
    .max(500)
    .optional()
    .or(z.literal("")),

  description: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")),

costPrice: z
  .number()
  .min(0, "Cost price cannot be negative"),

sellingPrice: z
  .number()
  .min(0, "Selling price cannot be negative"),
  
  comparePrice: z
    .number()
    .min(0, "Compare price cannot be negative")
    .optional()
    .default(0),

  thumbnail: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")),

  featured: z
    .boolean()
    .optional()
    .default(false),

  status: z
    .nativeEnum(Status)
    .optional()
    .default(Status.ACTIVE),
});

export const updateProductSchema =
  createProductSchema.partial();

export type CreateProductInput =
  z.infer<typeof createProductSchema>;

export type UpdateProductInput =
  z.infer<typeof updateProductSchema>;