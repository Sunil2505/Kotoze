import Role, { IRole } from "@/models/Role";
import BaseRepository from "./BaseRepository";

export default class RoleRepository
  extends BaseRepository<IRole> {
  constructor() {
    super(Role);
  }

  async getAll() {
    return Role.find({
      isActive: true,
    }).sort({
      name: 1,
    });
  }

  async getById(id: string) {
    return Role.findOne({
      _id: id,
      isActive: true,
    });
  }

  async findAnyById(id: string) {
    return Role.findOne({
      _id: id,
    });
  }

  async findByCode(code: string) {
    return Role.findOne({
      code: code.toUpperCase(),
    });
  }
}