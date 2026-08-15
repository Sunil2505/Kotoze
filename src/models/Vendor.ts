import mongoose, { Document, Model, Schema } from "mongoose";
import BaseSchema, { schemaOptions } from "./BaseModel";
import { Status } from "@/types/common";

export enum VendorApprovalStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export interface IVendor extends Document {
  vendorCode: string;

  businessName: string;
  legalName?: string;

  contactPerson: string;

  email?: string;
  mobile: string;

  gstNumber?: string;
  panNumber?: string;

  status: Status;
  approvalStatus: VendorApprovalStatus;

  isDeleted: boolean;
  deletedAt?: Date | null;

  createdAt: Date;
  updatedAt: Date;
}

const VendorSchema = new Schema<IVendor>(
  {
    vendorCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },

    businessName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    legalName: {
      type: String,
      default: "",
      trim: true,
    },

    contactPerson: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
      sparse: true,
      unique: true,
    },

    mobile: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
    },

    gstNumber: {
      type: String,
      default: "",
      trim: true,
      uppercase: true,
    },

    panNumber: {
      type: String,
      default: "",
      trim: true,
      uppercase: true,
    },

    status: {
      type: String,
      enum: Object.values(Status),
      default: Status.ACTIVE,
      index: true,
    },

    approvalStatus: {
      type: String,
      enum: Object.values(VendorApprovalStatus),
      default: VendorApprovalStatus.PENDING,
      index: true,
    },

    ...BaseSchema,
  },
  schemaOptions
);

VendorSchema.index({ businessName: "text" });


const Vendor: Model<IVendor> =
  mongoose.models.Vendor ||
  mongoose.model<IVendor>("Vendor", VendorSchema);

export default mongoose.models.Vendor ||
  mongoose.model("Vendor", VendorSchema);