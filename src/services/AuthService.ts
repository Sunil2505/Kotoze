import bcrypt from "bcryptjs";

import UserRepository from "@/repositories/UserRepository";
import AppError from "@/core/errors/AppError";
import { generateAccessToken } from "@/lib/auth/jwt";
import { Status } from "@/types/common";

export default class AuthService {
  private userRepository = new UserRepository();

  async login(login: string, password: string) {
    const user =
      await this.userRepository.findByMobileOrEmail(
        login
      );

    if (!user || user.isDeleted) {
      throw new AppError(
        "Invalid credentials.",
        401
      );
    }

    if (user.status !== Status.ACTIVE) {
      throw new AppError(
        "User account is not active.",
        403
      );
    }

    const isPasswordValid =
      await bcrypt.compare(
        password,
        user.passwordHash
      );

    if (!isPasswordValid) {
      throw new AppError(
        "Invalid credentials.",
        401
      );
    }

    const token =
      await generateAccessToken({
        userId: user._id.toString(),
        roleId: user.roleId.toString(),
      });

    return {
      token,
      user,
    };
  }
}