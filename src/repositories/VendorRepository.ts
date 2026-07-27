import { FilterQuery } from "mongoose";

import BaseRepository from "./BaseRepository";
import Vendor, { IVendor } from "@/models/Vendor";

export default class VendorRepository extends BaseRepository<IVendor> {
  constructor() {
    super(Vendor);
  }

  async findByBusinessName(businessName: string) {
    return this.findOne({
      businessName,
      isDeleted: false,
    });
  }

  async findByMobile(mobile: string) {
    return this.findOne({
      mobile,
      isDeleted: false,
    });
  }

  async findByEmail(email: string) {
    return this.findOne({
      email,
      isDeleted: false,
    });
  }

  async findByVendorCode(vendorCode: string) {
    return this.findOne({
      vendorCode,
      isDeleted: false,
    });
  }

  async getAll(filter: FilterQuery<IVendor> = {}) {
    return this.find({
      ...filter,
      isDeleted: false,
    });
  }

  async softDelete(id: string) {
    return this.update(id, {
      isDeleted: true,
      deletedAt: new Date(),
    });
  }
}