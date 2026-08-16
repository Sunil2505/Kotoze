import mongoose from "mongoose";

import Inventory, {
  IInventory,
} from "@/models/Inventory";
import InventoryTransaction from "@/models/InventoryTransaction";

import InventoryBatch from "@/models/InventoryBatch";

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
    batchId?: mongoose.Types.ObjectId;
    batchNumber?: string;
    expiryDate?: Date | null;
    costPrice?: number;

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
      batchId,
      batchNumber,
      expiryDate,
      costPrice,

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

    if (costPrice != null && costPrice < 0) {
      throw new Error(
        "Cost price cannot be negative."
      );
    }

    if (!batchId && !batchNumber?.trim()) {
      throw new Error(
        "Batch number is required."
      );
    }

    const session =
      await mongoose.startSession();

    let inventory: IInventory | null = null;

    try {
      await session.withTransaction(async () => {

        // --------------------------------
        // 1. Inventory
        // --------------------------------

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

        // --------------------------------
        // 2. Inventory Batch
        // --------------------------------

        let currentBatch;

        if (batchId) {
          currentBatch =
            await InventoryBatch.findOneAndUpdate(
              {
                _id: batchId,
                productId,
                isDeleted: false,
              },
              {
                $inc: {
                  quantity,
                  availableQuantity: quantity,
                },
              },
              {
                new: true,
                session,
              }
            );

          if (!currentBatch) {
            throw new Error(
              "Inventory batch not found."
            );
          }
        } else {
          currentBatch =
            await InventoryBatch.create(
              [
                {
                  inventoryId: inventory._id,
                  productId,

                  batchNumber:
                    batchNumber!.trim(),

                  quantity,
                  availableQuantity:
                    quantity,

                  costPrice:
                    costPrice ?? 0,

                  expiryDate:
                    expiryDate ?? null,
                },
              ],
              { session }
            ).then(
              (batches) => batches[0]
            );
        }

        // --------------------------------
        // 3. Inventory Transaction
        // --------------------------------

        await InventoryTransaction.create(
          [
            {
              inventoryId: inventory._id,
              productId,
              batchId: currentBatch._id,

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