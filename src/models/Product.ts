import mongoose, { Schema, models, model } from "mongoose";

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
    },

    brand: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    oldPrice: {
      type: Number,
      default: 0,
    },

    discount: {
      type: String,
      default: "",
    },

    stock: {
      type: Number,
      default: 0,
    },

    image: {
      type: String,
      required: true,
    },

    gallery: {
      type: [String],
      default: [],
    },

    description: {
      type: String,
      default: "",
    },

    specifications: {
      type: Map,
      of: String,
      default: {},
    },

    rating: {
      type: Number,
      default: 0,
    },

    reviews: {
      type: Number,
      default: 0,
    },

    featured: {
      type: Boolean,
      default: false,
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default models.Product || model("Product", ProductSchema);