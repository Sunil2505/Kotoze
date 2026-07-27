import { IBrand } from "@/models/Brand";
import Brand from "@/models/Brand";

import BaseService from "./BaseService";
import BrandRepository from "@/repositories/BrandRepository";
import SlugService from "./SlugService";

export default class BrandService extends BaseService<IBrand> {
  private readonly brandRepository: BrandRepository;

  constructor() {
    const repository = new BrandRepository();

    super(repository);

    this.brandRepository = repository;
  }

  async getAll() {
    return this.brandRepository.getAll();
  }

  async getById(id: string) {
    const brand = await this.brandRepository.findById(id);

    if (!brand || (brand as any).isDeleted) {
      throw new Error("Brand not found.");
    }

    return brand;
  }

  async createBrand(data: Partial<IBrand>) {
    if (!data.name) {
      throw new Error("Brand name is required.");
    }

    const name = data.name.trim();

    const exists = await this.brandRepository.findByName(name);

    if (exists) {
      throw new Error("Brand name already exists.");
    }

    const slug = await SlugService.generateUnique(
      Brand,
      name
    );

    return this.brandRepository.create({
      ...data,
      name,
      slug,
    });
  }

  async updateBrand(
    id: string,
    data: Partial<IBrand>
  ) {
    const brand = await this.brandRepository.findById(id);

    if (!brand || (brand as any).isDeleted) {
      throw new Error("Brand not found.");
    }

    const updateData: Partial<IBrand> = {
      ...data,
    };

    if (
      data.name &&
      data.name.trim() !== brand.name
    ) {
      const exists = await this.brandRepository.findByName(
        data.name.trim()
      );

      if (
        exists &&
        exists._id.toString() !== id
      ) {
        throw new Error("Brand name already exists.");
      }

      updateData.name = data.name.trim();

      updateData.slug = await SlugService.generateUnique(
        Brand,
        data.name.trim()
      );
    }

    return this.brandRepository.update(
      id,
      updateData
    );
  }

  async deleteBrand(id: string) {
    const brand = await this.brandRepository.findById(id);

    if (!brand || (brand as any).isDeleted) {
      throw new Error("Brand not found.");
    }

    await this.brandRepository.softDelete(id);

    return true;
  }

  async findBySlug(slug: string) {
    return this.brandRepository.findBySlug(slug);
  }
}