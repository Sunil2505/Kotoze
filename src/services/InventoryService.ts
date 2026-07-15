import mongoose from "mongoose";
import Inventory from "@/models/Inventory";
import InventoryTransaction from "@/models/InventoryTransaction";
import {
  InventoryReferenceType,
  InventoryTransactionType,
} from "@/types/inventory";

export default class InventoryService {
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

    const session = await mongoose.startSession();

    try {
      let inventory;

      await session.withTransaction(async () => {
        inventory = await Inventory.findOneAndUpdate(
          { productId },
          {
            $inc: {
              availableStock: quantity,
            },
          },
          {
            new: true,
            upsert: true,
            session,
          }
        );

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