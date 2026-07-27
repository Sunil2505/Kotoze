import mongoose, { Document, Model, Schema } from "mongoose";
import BaseSchema, { schemaOptions } from "./BaseModel";
import { Status } from "@/types/common";

export interface ICategory extends Document {
  name: string;
  slug: string;

  description?: string;

  parentId?: mongoose.Types.ObjectId | null;

  image?: string;

  sortOrder: number;

  status: Status;

  isDeleted: boolean;
  deletedAt?: Date | null;

  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
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

    parentId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      default: null,
      index: true,
    },

    image: {
      type: String,
      default: "",
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

CategorySchema.index({ name: "text" });

const Category: Model<ICategory> =
  mongoose.models.Category ||
  mongoose.model<ICategory>("Category", CategorySchema);

export default Category;