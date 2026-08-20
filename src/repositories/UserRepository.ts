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
}