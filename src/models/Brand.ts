import mongoose, { Document, Model, Schema } from "mongoose";
import BaseSchema, { schemaOptions } from "./BaseModel";
import { Status } from "@/types/common";

export interface IBrand extends Document {
  name: string;
  slug: string;

  description?: string;

  logo?: string;
  website?: string;

  sortOrder: number;

  status: Status;

  isDeleted: boolean;
  deletedAt?: Date | null;

  createdAt: Date;
  updatedAt: Date;
}

const BrandSchema = new Schema<IBrand>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    description: {
      type: String,
      default: "",
    },

    logo: {
      type: String,
      default: "",
    },

    website: {
      type: String,
      default: "",
      trim: true,
    },

    sortOrder: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: Object.values(Status),
      default: Status.ACTIVE,
      index: true,
    },

    ...BaseSchema,
  },
  schemaOptions
);

BrandSchema.index({ name: "text" });

const Brand: Model<IBrand> =
  mongoose.models.Brand ||
  mongoose.model<IBrand>("Brand", BrandSchema);

export default Brand;