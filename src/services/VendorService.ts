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
    const mobile = data.mobile.trim();

    const mobileExists =
      await this.vendorRepository.findByMobile(mobile);

    if (mobileExists) {
      throw new Error("Mobile number already exists.");
    }

    if (data.email) {
      const email = data.email.trim().toLowerCase();

      const emailExists =
        await this.vendorRepository.findByEmail(email);

      if (emailExists) {
        throw new Error("Email already exists.");
      }
    }

    if (data.gstNumber) {
      const gstNumber = data.gstNumber.trim().toUpperCase();

      const gstExists =
        await this.vendorRepository.findByGstNumber(gstNumber);

      if (gstExists) {
        throw new Error("GST number already exists.");
      }
    }

    if (data.panNumber) {
      const panNumber = data.panNumber.trim().toUpperCase();

      const panExists =
        await this.vendorRepository.findByPanNumber(panNumber);

      if (panExists) {
        throw new Error("PAN number already exists.");
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
      mobile,
      email: data.email?.trim().toLowerCase(),
      gstNumber: data.gstNumber?.trim().toUpperCase(),
      panNumber: data.panNumber?.trim().toUpperCase(),
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

    /*
     * MOBILE DUPLICATE CHECK
     */
    if (data.mobile) {
      const mobile = data.mobile.trim();

      const mobileExists =
        await this.vendorRepository.findByMobile(
          mobile,
          id
        );

      if (mobileExists) {
        throw new Error("Mobile number already exists.");
      }
    }

    /*
     * EMAIL DUPLICATE CHECK
     */
    if (data.email) {
      const email = data.email.trim().toLowerCase();

      const emailExists =
        await this.vendorRepository.findByEmail(
          email,
          id
        );

      console.log("EMAIL DUPLICATE CHECK:", {
        currentVendorId: id,
        email,
        foundVendorId: emailExists?._id?.toString(),
      });

      if (emailExists) {
        throw new Error("Email already exists.");
      }
    }

    /*
     * GST NUMBER DUPLICATE CHECK
     */
    if (data.gstNumber) {
      const gstNumber =
        data.gstNumber.trim().toUpperCase();

      const gstExists =
        await this.vendorRepository.findByGstNumber(
          gstNumber,
          id
        );

      if (gstExists) {
        throw new Error("GST number already exists.");
      }
    }

    /*
     * PAN NUMBER DUPLICATE CHECK
     */
    if (data.panNumber) {
      const panNumber =
        data.panNumber.trim().toUpperCase();

      const panExists =
        await this.vendorRepository.findByPanNumber(
          panNumber,
          id
        );

      if (panExists) {
        throw new Error("PAN number already exists.");
      }
    }

    /*
     * BUSINESS NAME
     * Duplicate is allowed.
     */

    return this.vendorRepository.update(id, {
      ...data,
      businessName: data.businessName?.trim(),
      mobile: data.mobile?.trim(),
      email: data.email?.trim().toLowerCase(),
      gstNumber: data.gstNumber?.trim().toUpperCase(),
      panNumber: data.panNumber?.trim().toUpperCase(),
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