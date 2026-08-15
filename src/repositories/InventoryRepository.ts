import BaseRepository from "./BaseRepository";

import Inventory, {
  IInventory,
} from "@/models/Inventory";

class InventoryRepository extends BaseRepository<IInventory> {
  constructor() {
    super(Inventory);
  }

  async findByProduct(productId: string) {
    return this.model
      .findOne({
        productId,
        isDeleted: false,
      })
      .populate("productId");
  }

  async findAll() {
    return this.model
      .find({
        isDeleted: false,
      })
      .populate("productId");
  }

  async getById(id: string) {
    return this.model
      .findOne({
        _id: id,
        isDeleted: false,
      })
      .populate("productId");
  }
}

export default new InventoryRepository();