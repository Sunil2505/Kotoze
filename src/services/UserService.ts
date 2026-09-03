import mongoose from "mongoose";

import { IUser } from "@/models/User";
import {
  CreateUserInput,
  UpdateUserInput,
} from "@/validations/UserValidation";

import BaseService from "./BaseService";
import UserRepository from "@/repositories/UserRepository";
import { hashPassword } from "@/lib/auth/bcrypt";

export default class UserService
  extends BaseService<IUser> {
  private readonly userRepository: UserRepository;

  constructor() {
    const repository =
      new UserRepository();

    super(repository);

    this.userRepository =
      repository;
  }

  async getAll() {
    return this.userRepository.getAll();
  }

  async getById(id: string) {
    const user =
      await this.userRepository.getById(id);

    if (!user) {
      throw new Error(
        "User not found."
      );
    }

    return user;
  }

  async createUser(
    data: CreateUserInput
  ) {
    const mobile =
      data.mobile.trim();

    const mobileExists =
      await this.userRepository.findByMobile(
        mobile
      );

    if (mobileExists) {
      throw new Error(
        "Mobile number already exists."
      );
    }

    const email =
      data.email
        .trim()
        .toLowerCase();

    const emailExists =
      await this.userRepository.findByEmail(
        email
      );

    if (emailExists) {
      throw new Error(
        "Email already exists."
      );
    }

    // Username is case-sensitive.
    // Preserve the exact case entered by the user.
    const username =
      data.username.trim();

    const usernameExists =
      await this.userRepository.findByUsername(
        username
      );

    if (usernameExists) {
      throw new Error(
        "Username already exists."
      );
    }

    const passwordHash =
      await hashPassword(
        data.password
      );

    const fullName =
      `${data.firstName.trim()} ${data.lastName.trim()}`
        .trim();

    const user =
      await this.userRepository.create({
        roleId:
          new mongoose.Types.ObjectId(
            data.roleId
          ),

        vendorId:
          data.vendorId
            ? new mongoose.Types.ObjectId(
                data.vendorId
              )
            : null,

        username,

        firstName:
          data.firstName.trim(),

        lastName:
          data.lastName.trim(),

        fullName,

        mobile,

        email,

        passwordHash,

        status: data.status,
      });

    const response =
      user.toObject();

    delete (
      response as any
    ).passwordHash;

    return response;
  }

  async updateUser(
    id: string,
    data: UpdateUserInput
  ) {
    const user =
      await this.userRepository.findById(
        id
      );

    if (
      !user ||
      (user as any).isDeleted
    ) {
      throw new Error(
        "User not found."
      );
    }

    if (data.mobile) {
      const mobile =
        data.mobile.trim();

      if (
        mobile !==
        user.mobile
      ) {
        const exists =
          await this.userRepository.findByMobile(
            mobile
          );

        if (
          exists &&
          exists._id.toString() !==
            id
        ) {
          throw new Error(
            "Mobile number already exists."
          );
        }
      }
    }

    if (data.email) {
      const email =
        data.email
          .trim()
          .toLowerCase();

      if (
        email !==
        user.email
      ) {
        const exists =
          await this.userRepository.findByEmail(
            email
          );

        if (
          exists &&
          exists._id.toString() !==
            id
        ) {
          throw new Error(
            "Email already exists."
          );
        }
      }
    }

    if (
      data.username !==
      undefined
    ) {
      // Username is case-sensitive.
      // Preserve the exact case entered by the user.
      const username =
        data.username.trim();

      if (
        username !==
        user.username
      ) {
        const exists =
          await this.userRepository.findByUsername(
            username
          );

        if (
          exists &&
          exists._id.toString() !==
            id
        ) {
          throw new Error(
            "Username already exists."
          );
        }
      }
    }

    const updateData:
      Partial<IUser> = {};

    if (data.roleId) {
      updateData.roleId =
        new mongoose.Types.ObjectId(
          data.roleId
        );
    }

    if (
      data.vendorId !==
      undefined
    ) {
      updateData.vendorId =
        data.vendorId
          ? new mongoose.Types.ObjectId(
              data.vendorId
            )
          : null;
    }

    if (
      data.username !==
      undefined
    ) {
      // Preserve exact username case.
      updateData.username =
        data.username.trim();
    }

    if (data.firstName) {
      updateData.firstName =
        data.firstName.trim();
    }

    if (data.lastName) {
      updateData.lastName =
        data.lastName.trim();
    }

    if (data.mobile) {
      updateData.mobile =
        data.mobile.trim();
    }

    if (
      data.email !==
      undefined
    ) {
      updateData.email =
        data.email
          .trim()
          .toLowerCase();
    }

    if (data.status) {
      updateData.status =
        data.status;
    }

    if (
      data.firstName ||
      data.lastName
    ) {
      updateData.fullName =
        `${
          data.firstName ??
          user.firstName
        } ${
          data.lastName ??
          user.lastName
        }`.trim();
    }

    const updatedUser =
      await this.userRepository.update(
        id,
        updateData
      );

    if (!updatedUser) {
      throw new Error(
        "Unable to update user."
      );
    }

    const response =
      updatedUser.toObject();

    delete (
      response as any
    ).passwordHash;

    return response;
  }

  async deleteUser(
    id: string
  ) {
    const user =
      await this.userRepository.findById(
        id
      );

    if (
      !user ||
      (user as any).isDeleted
    ) {
      throw new Error(
        "User not found."
      );
    }

    await this.userRepository.softDelete(
      id
    );

    return true;
  }
}