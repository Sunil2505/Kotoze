import { Schema } from "mongoose";

const BaseSchema = {
  isDeleted: {
    type: Boolean,
    default: false,
    index: true,
  },

  deletedAt: {
    type: Date,
    default: null,
  },
};

export const schemaOptions = {
  timestamps: true,
  versionKey: false,
};

export default BaseSchema;