import { FilterQuery } from "mongoose";

import BaseRepository from "./BaseRepository";
import Product, { IProduct } from "@/models/Product";

export default class ProductRepository extends BaseRepository<IProduct> {
  constructor() {
    super(Product);
  }

  async findBySku(sku: string) {
    return this.findOne({
      sku,
      isDeleted: false,
    });
  }

  async findBySlug(slug: string) {
    return this.findOne({
      slug,
      isDeleted: false,
    });
  }

  async findByName(name: string) {
    return this.findOne({
      name,
      isDeleted: false,
    });
  }

  async getAll(filter: FilterQuery<IProduct> = {}) {
    return this.model
      .find({
        ...filter,
        isDeleted: false,
      })
      .populate("vendorId", "businessName vendorCode")
      .populate("categoryId", "name")
      .populate("brandId", "name")
      .sort({ createdAt: -1 });
  }

  async getById(id: string) {
    return this.model
      .findOne({
        _id: id,
        isDeleted: false,
      })
      .populate("vendorId", "businessName vendorCode")
      .populate("categoryId", "name")
      .populate("brandId", "name");
  }

  async softDelete(id: string) {
    return this.update(id, {
      isDeleted: true,
      deletedAt: new Date(),
    });
  }
}