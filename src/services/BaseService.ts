import BaseRepository from "@/repositories/BaseRepository";

export default abstract class BaseService<T> {
  constructor(
    protected readonly repository: BaseRepository<any>
  ) {}

  async findById(id: string) {
    return this.repository.findById(id);
  }

  async create(data: Partial<T>) {
    return this.repository.create(data);
  }

  async update(
    id: string,
    data: Partial<T>
  ) {
    return this.repository.update(id, data);
  }

  async delete(id: string) {
    return this.repository.softDelete(id);
  }
}