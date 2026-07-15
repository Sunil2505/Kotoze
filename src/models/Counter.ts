import mongoose, { Document, Model, Schema } from "mongoose";

export interface ICounter extends Document {
  key: string;
  value: number;

  createdAt: Date;
  updatedAt: Date;
}

const CounterSchema = new Schema<ICounter>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },

    value: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Counter: Model<ICounter> =
  mongoose.models.Counter ||
  mongoose.model<ICounter>("Counter", CounterSchema);

export default Counter;