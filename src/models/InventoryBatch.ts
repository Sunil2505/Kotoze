import mongoose, { Document, Model, Schema } from "mongoose";
import BaseSchema, { schemaOptions } from "./BaseModel";
import { Status } from "@/types/common";

export interface IInventoryBatch extends Document {
  inventoryId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;

  batchNumber: string;

  quantity: number;
  availableQuantity: number;

  costPrice: number;

  expiryDate?: Date | null;

  status: Status;

  isDeleted: boolean;
  deletedAt?: Date | null;

  createdAt: Date;
  updatedAt: Date;
}

const InventoryBatchSchema = new Schema<IInventoryBatch>(
  {
    inventoryId: {
      type: Schema.Types.ObjectId,
      ref: "Inventory",
      required: true,
      index: true,
    },

    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },

    batchNumber: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 0,
    },

    availableQuantity: {
      type: Number,
      required: true,
      min: 0,
    },

    costPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    expiryDate: {
      type: Date,
      default: null,
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

// Same batch number can exist for different products,
// but not twice for the same product.
InventoryBatchSchema.index(
  {
    productId: 1,
    batchNumber: 1,
  },
  {
    unique: true,
  }
);

// Product batch listing
InventoryBatchSchema.index({
  productId: 1,
  createdAt: -1,
});

// Expiry tracking
InventoryBatchSchema.index({
  expiryDate: 1,
});

// Active batch queries
InventoryBatchSchema.index({
  status: 1,
  isDeleted: 1,
});

const InventoryBatch: Model<IInventoryBatch> =
  mongoose.models.InventoryBatch ||
  mongoose.model<IInventoryBatch>(
    "InventoryBatch",
    InventoryBatchSchema
  );

export default InventoryBatch;