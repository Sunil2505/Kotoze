import {
  Document,
  Schema,
  model,
  models,
} from "mongoose";

import BaseSchema, {
  schemaOptions,
} from "@/models/BaseModel";

export interface IExport
  extends Document {
  fileName: string;

  fileType:
    | "csv"
    | "xlsx"
    | "pdf";

  module: string;

  storageKey: string;

  fileSize: number;

  createdBy: string;

  status:
    | "processing"
    | "completed"
    | "failed";
}

const ExportSchema =
  new Schema<IExport>(
    {
      ...BaseSchema,

      fileName: {
        type: String,
        required: true,
        trim: true,
      },

      fileType: {
        type: String,
        required: true,
        enum: [
          "csv",
          "xlsx",
          "pdf",
        ],
        index: true,
      },

      module: {
        type: String,
        required: true,
        trim: true,
        index: true,
      },

      storageKey: {
        type: String,
        required: true,
        trim: true,
      },

      fileSize: {
        type: Number,
        default: 0,
      },

      createdBy: {
        type: String,
        required: true,
        index: true,
      },

      status: {
        type: String,
        required: true,
        enum: [
          "processing",
          "completed",
          "failed",
        ],
        default: "processing",
        index: true,
      },
    },
    schemaOptions
  );

const Export =
  models.Export ||
  model<IExport>(
    "Export",
    ExportSchema
  );

export default Export;