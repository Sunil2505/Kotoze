import mongoose, { Document, Model, Schema } from "mongoose";
import BaseSchema, { schemaOptions } from "./BaseModel";
import { Status } from "@/types/common";

export interface IInventory extends Document {
  productId: mongoose.Types.ObjectId;

  availableStock: number;
  reservedStock: number;

  minimumStock: number;
  maximumStock: number;
  reorderLevel: number;

  status: Status;

  isDeleted: boolean;
  deletedAt?: Date | null;

  createdAt: Date;
  updatedAt: Date;
}

const InventorySchema = new Schema<IInventory>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      unique: true,
      index: true,
    },

    availableStock: {
      type: Number,
      default: 0,
      min: 0,
    },

    reservedStock: {
      type: Number,
      default: 0,
      min: 0,
    },

    minimumStock: {
      type: Number,
      default: 0,
      min: 0,
    },

    maximumStock: {
      type: Number,
      default: 0,
      min: 0,
    },

    reorderLevel: {
      type: Number,
      default: 0,
      min: 0,
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

const Inventory: Model<IInventory> =
  mongoose.models.Inventory ||
  mongoose.model<IInventory>("Inventory", InventorySchema);

export default Inventory;