import InventoryBatch, {
  IInventoryBatch,
} from "@/models/InventoryBatch";

import BaseService from "./BaseService";
import InventoryBatchRepository from "@/repositories/InventoryBatchRepository";

export default class InventoryBatchService extends BaseService<IInventoryBatch> {
  private readonly inventoryBatchRepository: InventoryBatchRepository;

  constructor() {
    const repository = new InventoryBatchRepository();

    super(repository);

    this.inventoryBatchRepository = repository;
  }

  async getAll() {
    return this.inventoryBatchRepository.getAll();
  }

  async getById(id: string) {
    const batch =
      await this.inventoryBatchRepository.getById(id);

    if (!batch || (batch as any).isDeleted) {
      throw new Error("Inventory batch not found.");
    }

    return batch;
  }

  async getByProductId(productId: string) {
    return this.inventoryBatchRepository.getByProductId(
      productId
    );
  }

  async createBatch(
    data: Partial<IInventoryBatch>
  ) {
    if (!data.inventoryId) {
      throw new Error("Inventory is required.");
    }

    if (!data.productId) {
      throw new Error("Product is required.");
    }

    if (!data.batchNumber?.trim()) {
      throw new Error("Batch number is required.");
    }

    if (data.quantity == null) {
      throw new Error("Quantity is required.");
    }

    if (data.costPrice == null) {
      throw new Error("Cost price is required.");
    }

    if (data.quantity < 0) {
      throw new Error("Quantity cannot be negative.");
    }

    if (data.costPrice < 0) {
      throw new Error("Cost price cannot be negative.");
    }

    const availableQuantity =
      data.availableQuantity ?? data.quantity;

    if (availableQuantity < 0) {
      throw new Error(
        "Available quantity cannot be negative."
      );
    }

    if (availableQuantity > data.quantity) {
      throw new Error(
        "Available quantity cannot exceed quantity."
      );
    }

    const batchNumber = data.batchNumber.trim();

    const existingBatch =
      await this.inventoryBatchRepository.findByBatchNumber(
        data.productId.toString(),
        batchNumber
      );

    if (existingBatch) {
      throw new Error(
        "Batch number already exists for this product."
      );
    }

    return this.inventoryBatchRepository.create({
      ...data,
      batchNumber,
      availableQuantity,
      status: data.status,
      expiryDate: data.expiryDate ?? null,
    });
  }

  async updateBatch(
    id: string,
    data: Partial<IInventoryBatch>
  ) {
    const batch =
      await this.inventoryBatchRepository.findById(id);

    if (!batch || (batch as any).isDeleted) {
      throw new Error("Inventory batch not found.");
    }

    if (
      data.batchNumber !== undefined &&
      !data.batchNumber.trim()
    ) {
      throw new Error("Batch number is required.");
    }

    if (
      data.quantity != null &&
      data.quantity < 0
    ) {
      throw new Error("Quantity cannot be negative.");
    }

    if (
      data.costPrice != null &&
      data.costPrice < 0
    ) {
      throw new Error("Cost price cannot be negative.");
    }

    const quantity =
      data.quantity ?? batch.quantity;

    const availableQuantity =
      data.availableQuantity ??
      batch.availableQuantity;

    if (availableQuantity < 0) {
      throw new Error(
        "Available quantity cannot be negative."
      );
    }

    if (availableQuantity > quantity) {
      throw new Error(
        "Available quantity cannot exceed quantity."
      );
    }

    let batchNumber = batch.batchNumber;

    if (
      data.batchNumber &&
      data.batchNumber.trim() !==
        batch.batchNumber
    ) {
      batchNumber = data.batchNumber.trim();

      const productId =
        data.productId?.toString() ??
        batch.productId.toString();

      const existingBatch =
        await this.inventoryBatchRepository.findByBatchNumber(
          productId,
          batchNumber
        );

      if (
        existingBatch &&
        existingBatch._id.toString() !== id
      ) {
        throw new Error(
          "Batch number already exists for this product."
        );
      }
    }

    return this.inventoryBatchRepository.update(id, {
      ...data,
      batchNumber,
      quantity,
      availableQuantity,
      expiryDate:
        data.expiryDate !== undefined
          ? data.expiryDate
          : batch.expiryDate,
    });
  }

  async deleteBatch(id: string) {
    const batch =
      await this.inventoryBatchRepository.findById(id);

    if (!batch || (batch as any).isDeleted) {
      throw new Error("Inventory batch not found.");
    }

    await this.inventoryBatchRepository.softDelete(id);

    return true;
  }

  async findByBatchNumber(
    productId: string,
    batchNumber: string
  ) {
    return this.inventoryBatchRepository.findByBatchNumber(
      productId,
      batchNumber.trim()
    );
  }
}