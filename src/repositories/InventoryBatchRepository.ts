import { FilterQuery } from "mongoose";

import BaseRepository from "./BaseRepository";
import InventoryBatch, {
  IInventoryBatch,
} from "@/models/InventoryBatch";

export default class InventoryBatchRepository extends BaseRepository<IInventoryBatch> {
  constructor() {
    super(InventoryBatch);
  }

  async findByBatchNumber(
    productId: string,
    batchNumber: string
  ) {
    return this.findOne({
      productId,
      batchNumber,
      isDeleted: false,
    });
  }

  async getAll(
    filter: FilterQuery<IInventoryBatch> = {}
  ) {
    return this.model
      .find({
        ...filter,
        isDeleted: false,
      })
      .populate("productId", "name sku")
      .sort({ createdAt: -1 });
  }

  async getById(id: string) {
    return this.model
      .findOne({
        _id: id,
        isDeleted: false,
      })
      .populate("productId", "name sku");
  }

  async getByProductId(productId: string) {
    return this.model
      .find({
        productId,
        isDeleted: false,
      })
      .sort({ createdAt: -1 });
  }

  async softDelete(id: string) {
    return this.update(id, {
      isDeleted: true,
      deletedAt: new Date(),
    });
  }
} 