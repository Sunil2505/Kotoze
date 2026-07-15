import {
  Document,
  FilterQuery,
  Model,
  UpdateQuery,
} from "mongoose";

export default class BaseRepository<T extends Document> {
  constructor(protected readonly model: Model<T>) {}

  async create(data: Partial<T>): Promise<T> {
    return this.model.create(data);
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findById(id);
  }

  async findOne(filter: FilterQuery<T>): Promise<T | null> {
    return this.model.findOne(filter);
  }

  async find(filter: FilterQuery<T> = {}): Promise<T[]> {
    return this.model.find(filter);
  }

  async update(
    id: string,
    data: UpdateQuery<T>
  ): Promise<T | null> {
    return this.model.findByIdAndUpdate(
      id,
      data,
      {
        new: true,
      }
    );
  }

  async softDelete(id: string): Promise<T | null> {
    return this.model.findByIdAndUpdate(
      id,
      {
        isDeleted: true,
        deletedAt: new Date(),
      } as UpdateQuery<T>,
      {
        new: true,
      }
    );
  }
}