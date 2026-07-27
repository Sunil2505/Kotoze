import { IVendor } from "@/models/Vendor";

import BaseService from "./BaseService";
import VendorRepository from "@/repositories/VendorRepository";
import SequenceService from "./SequenceService";

export default class VendorService extends BaseService<IVendor> {
  private readonly vendorRepository: VendorRepository;

  constructor() {
    const repository = new VendorRepository();

    super(repository);

    this.vendorRepository = repository;
  }

  async getAll() {
    return this.vendorRepository.getAll();
  }

  async getById(id: string) {
    const vendor = await this.vendorRepository.findById(id);

    if (!vendor || (vendor as any).isDeleted) {
      throw new Error("Vendor not found.");
    }

    return vendor;
  }

  async createVendor(data: Partial<IVendor>) {
    if (!data.businessName) {
      throw new Error("Business name is required.");
    }

    if (!data.contactPerson) {
      throw new Error("Contact person is required.");
    }

    if (!data.mobile) {
      throw new Error("Mobile number is required.");
    }

    const businessName = data.businessName.trim();

    const businessExists =
      await this.vendorRepository.findByBusinessName(
        businessName
      );

    if (businessExists) {
      throw new Error("Business name already exists.");
    }

    const mobileExists =
      await this.vendorRepository.findByMobile(
        data.mobile.trim()
      );

    if (mobileExists) {
      throw new Error("Mobile number already exists.");
    }

    if (data.email) {
      const emailExists =
        await this.vendorRepository.findByEmail(
          data.email.trim().toLowerCase()
        );

      if (emailExists) {
        throw new Error("Email already exists.");
      }
    }

 const vendorCode = await SequenceService.nextCode(
  "vendor",
  "VND"
);

    return this.vendorRepository.create({
      ...data,
      vendorCode,
      businessName,
      mobile: data.mobile.trim(),
      email: data.email?.trim().toLowerCase(),
    });
  }

  async updateVendor(
    id: string,
    data: Partial<IVendor>
  ) {
    const vendor =
      await this.vendorRepository.findById(id);

    if (!vendor || (vendor as any).isDeleted) {
      throw new Error("Vendor not found.");
    }

    if (
      data.businessName &&
      data.businessName.trim() !== vendor.businessName
    ) {
      const exists =
        await this.vendorRepository.findByBusinessName(
          data.businessName.trim()
        );

      if (
        exists &&
        exists._id.toString() !== id
      ) {
        throw new Error("Business name already exists.");
      }
    }

    if (
      data.mobile &&
      data.mobile.trim() !== vendor.mobile
    ) {
      const exists =
        await this.vendorRepository.findByMobile(
          data.mobile.trim()
        );

      if (
        exists &&
        exists._id.toString() !== id
      ) {
        throw new Error("Mobile number already exists.");
      }
    }

    if (
      data.email &&
      data.email.trim().toLowerCase() !== vendor.email
    ) {
      const exists =
        await this.vendorRepository.findByEmail(
          data.email.trim().toLowerCase()
        );

      if (
        exists &&
        exists._id.toString() !== id
      ) {
        throw new Error("Email already exists.");
      }
    }

    return this.vendorRepository.update(id, {
      ...data,
      businessName: data.businessName?.trim(),
      mobile: data.mobile?.trim(),
      email: data.email?.trim().toLowerCase(),
    });
  }

  async deleteVendor(id: string) {
    const vendor =
      await this.vendorRepository.findById(id);

    if (!vendor || (vendor as any).isDeleted) {
      throw new Error("Vendor not found.");
    }

    await this.vendorRepository.softDelete(id);

    return true;
  }

  async findByVendorCode(vendorCode: string) {
    return this.vendorRepository.findByVendorCode(
      vendorCode
    );
  }
}