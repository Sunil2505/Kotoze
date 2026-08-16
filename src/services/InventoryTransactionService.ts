import InventoryTransaction, {
  IInventoryTransaction,
} from "@/models/InventoryTransaction";

import BaseService from "./BaseService";
import InventoryTransactionRepository from "@/repositories/InventoryTransactionRepository";

export default class InventoryTransactionService extends BaseService<IInventoryTransaction> {
  private readonly inventoryTransactionRepository: InventoryTransactionRepository;

  constructor() {
    const repository =
      new InventoryTransactionRepository();

    super(repository);

    this.inventoryTransactionRepository =
      repository;
  }

  async getAll() {
    return this.inventoryTransactionRepository.getAll();
  }

  async getById(id: string) {
    const transaction =
      await this.inventoryTransactionRepository.getById(
        id
      );

    if (
      !transaction ||
      (transaction as any).isDeleted
    ) {
      throw new Error(
        "Inventory transaction not found."
      );
    }

    return transaction;
  }

  async getByInventoryId(
    inventoryId: string
  ) {
    return this.inventoryTransactionRepository
      .getByInventoryId(inventoryId);
  }

  async getByProductId(
    productId: string
  ) {
    return this.inventoryTransactionRepository
      .getByProductId(productId);
  }

  async getByBatchId(
    batchId: string
  ) {
    return this.inventoryTransactionRepository
      .getByBatchId(batchId);
  }

  async createTransaction(
    data: Partial<IInventoryTransaction>
  ) {
    if (!data.inventoryId) {
      throw new Error(
        "Inventory is required."
      );
    }

    if (!data.productId) {
      throw new Error(
        "Product is required."
      );
    }

    if (!data.batchId) {
      throw new Error(
        "Batch is required."
      );
    }

    if (!data.transactionType) {
      throw new Error(
        "Transaction type is required."
      );
    }

    if (!data.referenceType) {
      throw new Error(
        "Reference type is required."
      );
    }

    if (data.quantity == null) {
      throw new Error(
        "Quantity is required."
      );
    }

    if (data.quantity <= 0) {
      throw new Error(
        "Quantity must be greater than zero."
      );
    }

    return this.inventoryTransactionRepository.create({
      ...data,
      remarks: data.remarks?.trim() ?? "",
      referenceNumber:
        data.referenceNumber?.trim() ?? "",
    });
  }

  async deleteTransaction(id: string) {
    const transaction =
      await this.inventoryTransactionRepository.findById(
        id
      );

    if (
      !transaction ||
      (transaction as any).isDeleted
    ) {
      throw new Error(
        "Inventory transaction not found."
      );
    }

    await this.inventoryTransactionRepository
      .softDelete(id);

    return true;
  }
}