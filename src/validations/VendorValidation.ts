import { z } from "zod";
import { Status } from "@/types/common";
import { VendorApprovalStatus } from "@/models/Vendor";

export const createVendorSchema = z.object({
  businessName: z
    .string()
    .trim()
    .min(2, "Business name is required")
    .max(150),

  legalName: z
    .string()
    .trim()
    .max(150)
    .optional()
    .or(z.literal("")),

  contactPerson: z
    .string()
    .trim()
    .min(2, "Contact person is required")
    .max(100),

  email: z
    .string()
    .trim()
    .email("Invalid email")
    .optional()
    .or(z.literal("")),

  mobile: z
    .string()
    .trim()
    .min(10, "Invalid mobile number")
    .max(15),

  gstNumber: z
    .string()
    .trim()
    .max(20)
    .optional()
    .or(z.literal("")),

  panNumber: z
    .string()
    .trim()
    .max(20)
    .optional()
    .or(z.literal("")),

  status: z
    .nativeEnum(Status)
    .optional()
    .default(Status.ACTIVE),

  approvalStatus: z
    .nativeEnum(VendorApprovalStatus)
    .optional()
    .default(VendorApprovalStatus.PENDING),
});

export const updateVendorSchema = createVendorSchema.partial();

export type CreateVendorInput = z.infer<typeof createVendorSchema>;
export type UpdateVendorInput = z.infer<typeof updateVendorSchema>;