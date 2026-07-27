import Brand, { IBrand } from "@/models/Brand";
import BaseRepository from "./BaseRepository";

export default class BrandRepository extends BaseRepository<IBrand> {
  constructor() {
    super(Brand);
  }

  async findByName(name: string) {
    return this.model.findOne({
      name,
      isDeleted: false,
    });
  }

  async findBySlug(slug: string) {
    return this.model.findOne({
      slug,
      isDeleted: false,
    });
  }

  async getAll() {
    return this.model
      .find({
        isDeleted: false,
      })
      .sort({
        sortOrder: 1,
        name: 1,
      });
  }

  async softDelete(id: string) {
    return this.model.findByIdAndUpdate(
      id,
      {
        isDeleted: true,
        deletedAt: new Date(),
      },
      {
        new: true,
      }
    );
  }
}