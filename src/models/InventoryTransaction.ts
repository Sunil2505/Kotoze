import mongoose, { Document, Model, Schema } from "mongoose";
import BaseSchema, { schemaOptions } from "./BaseModel";
import {
  InventoryReferenceType,
  InventoryTransactionType,
} from "@/types/inventory";

export interface IInventoryTransaction extends Document {
  inventoryId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;

  transactionType: InventoryTransactionType;
  referenceType: InventoryReferenceType;

  referenceId?: mongoose.Types.ObjectId | null;
  referenceNumber?: string;

  quantity: number;

  remarks?: string;

  createdBy?: mongoose.Types.ObjectId | null;

  isDeleted: boolean;
  deletedAt?: Date | null;

  createdAt: Date;
  updatedAt: Date;
}

const InventoryTransactionSchema = new Schema<IInventoryTransaction>(
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

    transactionType: {
      type: String,
      enum: Object.values(InventoryTransactionType),
      required: true,
      index: true,
    },

    referenceType: {
      type: String,
      enum: Object.values(InventoryReferenceType),
      required: true,
      index: true,
    },

    referenceId: {
      type: Schema.Types.ObjectId,
      default: null,
      index: true,
    },

    referenceNumber: {
      type: String,
      default: "",
      trim: true,
      index: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    remarks: {
      type: String,
      default: "",
      trim: true,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    ...BaseSchema,
  },
  schemaOptions
);

// Inventory history by inventory
InventoryTransactionSchema.index({
  inventoryId: 1,
  createdAt: -1,
});

// Product transaction history
InventoryTransactionSchema.index({
  productId: 1,
  createdAt: -1,
});

// Transaction type filtering
InventoryTransactionSchema.index({
  transactionType: 1,
});

// Product + transaction type history
InventoryTransactionSchema.index({
  productId: 1,
  transactionType: 1,
  createdAt: -1,
});

// Active transaction history
InventoryTransactionSchema.index({
  isDeleted: 1,
  createdAt: -1,
});

const InventoryTransaction: Model<IInventoryTransaction> =
  mongoose.models.InventoryTransaction ||
  mongoose.model<IInventoryTransaction>(
    "InventoryTransaction",
    InventoryTransactionSchema
  );

export default InventoryTransaction;