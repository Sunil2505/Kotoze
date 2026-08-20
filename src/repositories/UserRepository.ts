import "@/models/Role";
import User, { IUser } from "@/models/User";
import BaseRepository from "./BaseRepository";

export default class UserRepository extends BaseRepository<IUser> {
  constructor() {
    super(User);
  }

  async findByMobile(mobile: string) {
    return User.findOne({ mobile });
  }

  async findByEmail(email: string) {
    return User.findOne({ email });
  }

  async findByMobileOrEmail(login: string) {
    return User.findOne({
      $or: [
        { mobile: login },
        { email: login.toLowerCase() },
      ],
    }).populate("roleId");
  }

  async findByIdWithRole(id: string) {
    return User.findOne({
      _id: id,
      isDeleted: false,
    })
      .select("-passwordHash")
      .populate("roleId");
  }

  async updateLastLoginAt(id: string) {
    return User.findOneAndUpdate(
      {
        _id: id,
        isDeleted: false,
      },
      {
        $set: {
          lastLoginAt: new Date(),
        },
      },
      {
        new: true,
        runValidators: true,
      }
    ).populate("roleId");
  }
}