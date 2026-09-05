import { FilterQuery } from "mongoose";

import BaseRepository from "./BaseRepository";
import Vendor, { IVendor } from "@/models/Vendor";

export default class VendorRepository extends BaseRepository<IVendor> {
  constructor() {
    super(Vendor);
  }

  async findByMobile(mobile: string, excludeId?: string) {
    return this.findOne({
      mobile: mobile.trim(),
      isDeleted: false,
      ...(excludeId ? { _id: { $ne: excludeId } } : {}),
    });
  }

  async findByEmail(email: string, excludeId?: string) {
    return this.findOne({
      email: email.trim().toLowerCase(),
      isDeleted: false,
      ...(excludeId ? { _id: { $ne: excludeId } } : {}),
    });
  }

  async findByGstNumber(gstNumber: string, excludeId?: string) {
    return this.findOne({
      gstNumber: gstNumber.trim().toUpperCase(),
      isDeleted: false,
      ...(excludeId ? { _id: { $ne: excludeId } } : {}),
    });
  }

  async findByPanNumber(panNumber: string, excludeId?: string) {
    return this.findOne({
      panNumber: panNumber.trim().toUpperCase(),
      isDeleted: false,
      ...(excludeId ? { _id: { $ne: excludeId } } : {}),
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