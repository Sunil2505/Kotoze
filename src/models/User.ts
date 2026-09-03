import mongoose, {
  Document,
  Model,
  Schema,
} from "mongoose";

import BaseSchema, {
  schemaOptions,
} from "./BaseModel";

import { Status } from "@/types/common";

export interface IUser extends Document {
  roleId: mongoose.Types.ObjectId;
  vendorId?: mongoose.Types.ObjectId | null;

  username: string;

  firstName: string;
  lastName: string;
  fullName: string;

  email: string;
  mobile: string;

  passwordHash: string;

  avatar?: string;

  isEmailVerified: boolean;
  isMobileVerified: boolean;

  status: Status;

  lastLoginAt?: Date | null;

  isDeleted: boolean;
  deletedAt?: Date | null;

  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    roleId: {
      type: Schema.Types.ObjectId,
      ref: "Role",
      required: true,
      index: true,
    },

    vendorId: {
      type: Schema.Types.ObjectId,
      ref: "Vendor",
      default: null,
      index: true,
    },

    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
    },

    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      index: true,
    },

    mobile: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },

    passwordHash: {
      type: String,
      required: true,
    },

    avatar: {
      type: String,
      default: "",
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    isMobileVerified: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: Object.values(Status),
      default: Status.ACTIVE,
      index: true,
    },

    lastLoginAt: {
      type: Date,
      default: null,
    },

    ...BaseSchema,
  },
  schemaOptions
);

/**
 * Automatically generate full name before saving.
 */
UserSchema.pre("save", function (next) {
  this.fullName =
    `${this.firstName} ${this.lastName}`.trim();

  if (this.username) {
    this.username =
      this.username.trim();
  }

  next();
});

UserSchema.index({
  fullName: "text",
});

const User: Model<IUser> =
  mongoose.models.User ||
  mongoose.model<IUser>(
    "User",
    UserSchema
  );

export default User;