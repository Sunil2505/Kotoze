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
    },

    mobile: {
      type: String,
      required: true,
      trim: true,
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

/*
 * VENDOR CODE
 * Always unique.
 */
VendorSchema.index(
  { vendorCode: 1 },
  {
    unique: true,
  }
);

/*
 * EMAIL
 * Only non-deleted vendors must have a unique email.
 */
VendorSchema.index(
  { email: 1 },
  {
    unique: true,
    partialFilterExpression: {
      isDeleted: false,
      email: {
        $exists: true,
        $type: "string",
      },
    },
  }
);

/*
 * MOBILE
 * Only non-deleted vendors must have a unique mobile number.
 */
VendorSchema.index(
  { mobile: 1 },
  {
    unique: true,
    partialFilterExpression: {
      isDeleted: false,
    },
  }
);

/*
 * GST NUMBER
 * Only non-deleted vendors with a non-empty GST number
 * must have a unique GST number.
 */
VendorSchema.index(
  { gstNumber: 1 },
  {
    unique: true,
    partialFilterExpression: {
      isDeleted: false,
      gstNumber: {
        $exists: true,
        $ne: "",
      },
    },
  }
);

/*
 * PAN NUMBER
 * Only non-deleted vendors with a non-empty PAN number
 * must have a unique PAN number.
 */
VendorSchema.index(
  { panNumber: 1 },
  {
    unique: true,
    partialFilterExpression: {
      isDeleted: false,
      panNumber: {
        $exists: true,
        $ne: "",
      },
    },
  }
);

/*
 * BUSINESS NAME SEARCH
 */
VendorSchema.index({ businessName: "text" });

const Vendor: Model<IVendor> =
  mongoose.models.Vendor ||
  mongoose.model<IVendor>("Vendor", VendorSchema);

export default Vendor;