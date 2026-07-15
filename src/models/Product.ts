import mongoose, { Document, Model, Schema } from "mongoose";
import BaseSchema, { schemaOptions } from "./BaseModel";
import { Status } from "@/types/common";

export interface IProduct extends Document {
  sku: string;

  vendorId: mongoose.Types.ObjectId;
  categoryId: mongoose.Types.ObjectId;
  brandId: mongoose.Types.ObjectId;

  name: string;
  slug: string;

  shortDescription?: string;
  description?: string;

  costPrice: number;
  sellingPrice: number;
  comparePrice?: number;

  thumbnail?: string;

  featured: boolean;

  status: Status;

  isDeleted: boolean;
  deletedAt?: Date | null;

  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },

    vendorId: {
      type: Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
      index: true,
    },

    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },

    brandId: {
      type: Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
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

    shortDescription: {
      type: String,
      default: "",
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    costPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    sellingPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    comparePrice: {
      type: Number,
      default: 0,
      min: 0,
    },

    thumbnail: {
      type: String,
      default: "",
    },

    featured: {
      type: Boolean,
      default: false,
      index: true,
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

ProductSchema.index({ sku: 1 });
ProductSchema.index({ vendorId: 1 });
ProductSchema.index({ categoryId: 1 });
ProductSchema.index({ brandId: 1 });
ProductSchema.index({ slug: 1 });
ProductSchema.index({ status: 1 });
ProductSchema.index({ featured: 1 });
ProductSchema.index({ name: "text" });

const Product: Model<IProduct> =
  mongoose.models.Product ||
  mongoose.model<IProduct>("Product", ProductSchema);

export default Product;