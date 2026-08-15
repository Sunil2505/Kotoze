import mongoose from "mongoose";

import Inventory, {
  IInventory,
} from "@/models/Inventory";
import InventoryTransaction from "@/models/InventoryTransaction";

import InventoryRepository from "@/repositories/InventoryRepository";

import { AppError } from "@/lib/AppError";

import {
  InventoryReferenceType,
  InventoryTransactionType,
} from "@/types/inventory";

export default class InventoryService {
  /**
   * Get all inventories.
   */
  static async getAll() {
    return await InventoryRepository.findAll();
  }

  /**
   * Get inventory by id.
   */
  static async getById(id: string) {
    const inventory =
      await InventoryRepository.getById(id);

    if (!inventory) {
      throw new AppError(
        "Inventory not found",
        404
      );
    }

    return inventory;
  }

  /**
   * Update inventory settings.
   */
  static async updateInventory(
    id: string,
    data: {
      minimumStock?: number;
      maximumStock?: number;
      reorderLevel?: number;
      status?: string;
    }
  ) {
    const inventory =
      await InventoryRepository.update(id, data);

    if (!inventory) {
      throw new AppError(
        "Inventory not found",
        404
      );
    }

    return inventory;
  }

  /**
   * Soft delete inventory.
   */
  static async deleteInventory(id: string) {
    const inventory =
      await InventoryRepository.softDelete(id);

    if (!inventory) {
      throw new AppError(
        "Inventory not found",
        404
      );
    }

    return {
      message:
        "Inventory deleted successfully",
    };
  }

  /**
   * Increase available stock.
   */
  static async increaseStock(params: {
    productId: mongoose.Types.ObjectId;
    quantity: number;
    transactionType: InventoryTransactionType;
    referenceType: InventoryReferenceType;
    referenceId?: mongoose.Types.ObjectId;
    referenceNumber?: string;
    remarks?: string;
    createdBy?: mongoose.Types.ObjectId;
  }) {
    const {
      productId,
      quantity,
      transactionType,
      referenceType,
      referenceId,
      referenceNumber,
      remarks,
      createdBy,
    } = params;

    if (quantity <= 0) {
      throw new Error(
        "Quantity must be greater than zero."
      );
    }

    const session =
      await mongoose.startSession();

    let inventory: IInventory | null = null;

    try {
      await session.withTransaction(async () => {
        inventory =
          await Inventory.findOneAndUpdate(
            { productId },
            {
              $inc: {
                availableStock: quantity,
              },
              $setOnInsert: {
                reservedStock: 0,
                minimumStock: 0,
                maximumStock: 0,
                reorderLevel: 0,
              },
            },
            {
              new: true,
              upsert: true,
              session,
            }
          );

        if (!inventory) {
          throw new Error(
            "Failed to create or update inventory."
          );
        }

        await InventoryTransaction.create(
          [
            {
              inventoryId: inventory._id,
              productId,

              transactionType,
              referenceType,

              referenceId,
              referenceNumber,

              quantity,

              remarks,

              createdBy,
            },
          ],
          { session }
        );
      });

      return inventory;
    } finally {
      await session.endSession();
    }
  }
}