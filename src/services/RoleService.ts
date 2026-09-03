import { IRole } from "@/models/Role";

import BaseService from "./BaseService";
import RoleRepository from "@/repositories/RoleRepository";

export default class RoleService
  extends BaseService<IRole> {
  private readonly roleRepository: RoleRepository;

  constructor() {
    const repository =
      new RoleRepository();

    super(repository);

    this.roleRepository = repository;
  }

  async getAll() {
    return this.roleRepository.getAll();
  }

  async getById(id: string) {
    const role =
      await this.roleRepository.getById(id);

    if (!role) {
      throw new Error("Role not found.");
    }

    return role;
  }

  async findByCode(code: string) {
    return this.roleRepository.findByCode(
      code
    );
  }

  async updateRole(
    id: string,
    data: Partial<IRole>
  ) {
    const role =
      await this.roleRepository.findAnyById(
        id
      );

    if (!role) {
      throw new Error("Role not found.");
    }

    /*
     * System roles can be edited, but their
     * system/custom identity must never change.
     */
    if (role.isSystem) {
      /*
       * Remove fields that must not be changed
       * for system roles.
       */
      const {
        isSystem,
        code,
        ...systemRoleData
      } = data;

      /*
       * System roles must remain active.
       */
      if (systemRoleData.isActive === false) {
        throw new Error(
          "System roles cannot be deactivated."
        );
      }

      return this.roleRepository.update(
        id,
        {
          ...systemRoleData,
          isSystem: true,
          code: role.code,
        }
      );
    }

    /*
     * Custom roles
     */
    if (data.isSystem === true) {
      throw new Error(
        "Custom roles cannot be converted to system roles."
      );
    }

    return this.roleRepository.update(
      id,
      {
        ...data,
        isSystem: false,
        code: data.code
          ? data.code.toUpperCase()
          : undefined,
      }
    );
  }

  async deleteRole(id: string) {
    const role =
      await this.roleRepository.findAnyById(
        id
      );

    if (!role) {
      throw new Error("Role not found.");
    }

    /*
     * System roles cannot be deleted.
     */
    if (role.isSystem) {
      throw new Error(
        "System roles cannot be deleted."
      );
    }

    /*
     * Custom roles are soft-deleted by
     * deactivating them.
     */
    return this.roleRepository.update(id, {
      isActive: false,
    });
  }
}