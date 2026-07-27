import Product, { IProduct } from "@/models/Product";

import BaseService from "./BaseService";
import ProductRepository from "@/repositories/ProductRepository";
import SequenceService from "./SequenceService";
import SlugService from "./SlugService";

export default class ProductService extends BaseService<IProduct> {
  private readonly productRepository: ProductRepository;

  constructor() {
    const repository = new ProductRepository();

    super(repository);

    this.productRepository = repository;
  }

  async getAll() {
    return this.productRepository.getAll();
  }

  async getById(id: string) {
    const product = await this.productRepository.getById(id);

    if (!product || (product as any).isDeleted) {
      throw new Error("Product not found.");
    }

    return product;
  }

  async createProduct(data: Partial<IProduct>) {
    if (!data.name) {
      throw new Error("Product name is required.");
    }

    if (!data.vendorId) {
      throw new Error("Vendor is required.");
    }

    if (!data.categoryId) {
      throw new Error("Category is required.");
    }

    if (!data.brandId) {
      throw new Error("Brand is required.");
    }

    if (data.costPrice == null) {
      throw new Error("Cost price is required.");
    }

    if (data.sellingPrice == null) {
      throw new Error("Selling price is required.");
    }

    if (data.costPrice < 0) {
      throw new Error("Cost price cannot be negative.");
    }

    if (data.sellingPrice < 0) {
      throw new Error("Selling price cannot be negative.");
    }

    const name = data.name.trim();

    const sku = await SequenceService.nextCode("product", "PRD");

    const slug = await SlugService.generateUnique(
      Product,
      name
    );

    const skuExists = await this.productRepository.findBySku(sku);

    if (skuExists) {
      throw new Error("SKU already exists.");
    }

    const slugExists = await this.productRepository.findBySlug(slug);

    if (slugExists) {
      throw new Error("Slug already exists.");
    }

    return this.productRepository.create({
      ...data,
      sku,
      slug,
      name,
      shortDescription: data.shortDescription?.trim(),
      description: data.description?.trim(),
      comparePrice: data.comparePrice ?? 0,
      thumbnail: data.thumbnail ?? "",
      featured: data.featured ?? false,
    });
  }

  async updateProduct(
    id: string,
    data: Partial<IProduct>
  ) {
    const product = await this.productRepository.findById(id);

    if (!product || (product as any).isDeleted) {
      throw new Error("Product not found.");
    }

    let slug = product.slug;

    if (
      data.name &&
      data.name.trim() !== product.name
    ) {
        slug = await SlugService.generateUnique(
          Product,
          data.name.trim()
        );

      const exists =
        await this.productRepository.findBySlug(slug);

      if (
        exists &&
        exists._id.toString() !== id
      ) {
        throw new Error("Slug already exists.");
      }
    }

    if (
      data.costPrice != null &&
      data.costPrice < 0
    ) {
      throw new Error("Cost price cannot be negative.");
    }

    if (
      data.sellingPrice != null &&
      data.sellingPrice < 0
    ) {
      throw new Error("Selling price cannot be negative.");
    }

    return this.productRepository.update(id, {
      ...data,
      name: data.name?.trim(),
      slug,
      shortDescription: data.shortDescription?.trim(),
      description: data.description?.trim(),
    });
  }

  async deleteProduct(id: string) {
    const product = await this.productRepository.findById(id);

    if (!product || (product as any).isDeleted) {
      throw new Error("Product not found.");
    }

    await this.productRepository.softDelete(id);

    return true;
  }

  async findBySku(sku: string) {
    return this.productRepository.findBySku(sku);
  }

  async findBySlug(slug: string) {
    return this.productRepository.findBySlug(slug);
  }
}