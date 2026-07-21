import { ICategory } from "@/models/Category";
import Category from "@/models/Category";
import BaseService from "./BaseService";
import CategoryRepository from "@/repositories/CategoryRepository";
import SlugService from "./SlugService";

export default class CategoryService extends BaseService<ICategory> {
  private readonly categoryRepository: CategoryRepository;

  constructor() {
    const repository = new CategoryRepository();

    super(repository);

    this.categoryRepository = repository;
  }

  async getAll() {
    return this.categoryRepository.findAll();
  }

  async getActive() {
    return this.categoryRepository.findActive();
  }

  async getParentCategories() {
    return this.categoryRepository.findParentCategories();
  }

  async createCategory(data: Partial<ICategory>) {
    if (!data.name) {
      throw new Error("Category name is required.");
    }

    const name = data.name.trim();

    const exists = await this.categoryRepository.existsByName(name);

    if (exists) {
      throw new Error("Category name already exists.");
    }

    const slug = await SlugService.generateUnique(Category, name);

    return this.categoryRepository.create({
      ...data,
      name,
      slug,
    });
  }

  async updateCategory(
    id: string,
    data: Partial<ICategory>
  ) {
    const category = await this.categoryRepository.findById(id);

    if (!category) {
      throw new Error("Category not found.");
    }

    const updateData: Partial<ICategory> = {
      ...data,
    };

    if (data.name && data.name.trim() !== category.name) {
      const exists = await this.categoryRepository.existsByName(
        data.name.trim()
      );

      if (exists) {
        throw new Error("Category name already exists.");
      }

      updateData.name = data.name.trim();
      updateData.slug = await SlugService.generateUnique(
        Category,
        data.name.trim()
      );
    }

    return this.categoryRepository.update(id, updateData);
  }

  async deleteCategory(id: string) {
    const category = await this.categoryRepository.findById(id);

    if (!category) {
      throw new Error("Category not found.");
    }

    return this.categoryRepository.softDelete(id);
  }

  async search(keyword: string) {
    return this.categoryRepository.search(keyword);
  }

  async paginate(
    page: number,
    limit: number,
    search?: string,
    status?: ICategory["status"]
  ) {
    return this.categoryRepository.paginate(
      page,
      limit,
      search,
      status
    );
  }

  async updateStatus(
    id: string,
    status: ICategory["status"]
  ) {
    return this.categoryRepository.updateStatus(
      id,
      status
    );
  }

  async findBySlug(slug: string) {
    return this.categoryRepository.findBySlug(slug);
  }
}