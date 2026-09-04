import "@/models/Role";
import "@/models/Vendor";

import User, { IUser } from "@/models/User";
import BaseRepository from "./BaseRepository";

export default class UserRepository
  extends BaseRepository<IUser> {
  constructor() {
    super(User);
  }

  async findByMobile(
    mobile: string
  ) {
    return User.findOne({
      mobile,
      isDeleted: false,
    });
  }

  async findByEmail(
    email: string
  ) {
    return User.findOne({
      email:
        email.toLowerCase(),
      isDeleted: false,
    });
  }

async findByUsername(
  username: string
) {
  return User.findOne({
    username: username.trim(),
    isDeleted: false,
  }).populate("roleId");
}

  async findByMobileOrEmail(
    login: string
  ) {
    const normalizedLogin =
      login.trim();

    return User.findOne({
      isDeleted: false,
      $or: [
        {
          username:
            normalizedLogin,
        },
        {
          mobile:
            normalizedLogin,
        },
        {
          email:
            normalizedLogin.toLowerCase(),
        },
      ],
    }).populate("roleId");
  }

  async findByIdWithRole(
    id: string
  ) {
    return User.findOne({
      _id: id,
      isDeleted: false,
    })
      .select("-passwordHash")
      .populate("roleId");
  }

  async updateLastLoginAt(
    id: string
  ) {
    return User.findOneAndUpdate(
      {
        _id: id,
        isDeleted: false,
      },
      {
        $set: {
          lastLoginAt:
            new Date(),
        },
      },
      {
        new: true,
        runValidators: true,
      }
    ).populate("roleId");
  }

  /*
   * UPDATE PASSWORD
   *
   * The service layer must provide
   * an already bcrypt-hashed password.
   *
   * Plain-text passwords are never
   * stored in MongoDB.
   */
  async updatePassword(
    id: string,
    passwordHash: string
  ) {
    return User.findOneAndUpdate(
      {
        _id: id,
        isDeleted: false,
      },
      {
        $set: {
          passwordHash,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );
  }

  async getAll() {
    return User.find({
      isDeleted: false,
    })
      .select("-passwordHash")
      .populate("roleId")
      .populate("vendorId")
      .sort({
        createdAt: -1,
      });
  }

  async getById(
    id: string
  ) {
    return User.findOne({
      _id: id,
      isDeleted: false,
    })
      .select("-passwordHash")
      .populate("roleId")
      .populate("vendorId");
  }
}