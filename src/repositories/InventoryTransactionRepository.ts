import { FilterQuery } from "mongoose";

import BaseRepository from "./BaseRepository";

import InventoryTransaction, {
  IInventoryTransaction,
} from "@/models/InventoryTransaction";

import "@/models/User";
import "@/models/InventoryBatch";
import "@/models/Inventory";
import "@/models/Product";

export default class InventoryTransactionRepository extends BaseRepository<IInventoryTransaction> {
  constructor() {
    super(InventoryTransaction);
  }

  async getAll(
    filter: FilterQuery<IInventoryTransaction> = {}
  ) {
    return this.model
      .find({
        ...filter,
        isDeleted: false,
      })
      .populate("inventoryId")
      .populate("productId", "name sku")
      .populate("batchId", "batchNumber")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });
  }

  async getById(id: string) {
    return this.model
      .findOne({
        _id: id,
        isDeleted: false,
      })
      .populate("inventoryId")
      .populate("productId", "name sku")
      .populate("batchId", "batchNumber")
      .populate("createdBy", "name email");
  }

  async getByInventoryId(
    inventoryId: string
  ) {
    return this.model
      .find({
        inventoryId,
        isDeleted: false,
      })
      .populate("productId", "name sku")
      .populate("batchId", "batchNumber")
      .sort({ createdAt: -1 });
  }

  async getByProductId(
    productId: string
  ) {
    return this.model
      .find({
        productId,
        isDeleted: false,
      })
      .populate("batchId", "batchNumber")
      .sort({ createdAt: -1 });
  }

  async getByBatchId(
    batchId: string
  ) {
    return this.model
      .find({
        batchId,
        isDeleted: false,
      })
      .populate("productId", "name sku")
      .sort({ createdAt: -1 });
  }

  async softDelete(id: string) {
    return this.update(id, {
      isDeleted: true,
      deletedAt: new Date(),
    });
  }
}