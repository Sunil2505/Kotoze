import { FilterQuery } from "mongoose";
import BaseRepository from "./BaseRepository";
import Category, { ICategory } from "@/models/Category";
import { Status } from "@/types/common";

export default class CategoryRepository extends BaseRepository<ICategory> {
  constructor() {
    super(Category);
  }

  async findAll() {
    return this.model
      .find({
        isDeleted: false,
      })
      .sort({
        sortOrder: 1,
        createdAt: -1,
      });
  }

  async findActive() {
    return this.model
      .find({
        isDeleted: false,
        status: Status.ACTIVE,
      })
      .sort({
        sortOrder: 1,
        createdAt: -1,
      });
  }

  async findBySlug(slug: string) {
    return this.model.findOne({
      slug,
      isDeleted: false,
    });
  }

  async existsByName(name: string) {
    return this.model.exists({
      name,
      isDeleted: false,
    });
  }

  async existsBySlug(slug: string) {
    return this.model.exists({
      slug,
      isDeleted: false,
    });
  }

  async findParentCategories() {
    return this.model
      .find({
        parentId: null,
        isDeleted: false,
        status: Status.ACTIVE,
      })
      .sort({
        sortOrder: 1,
        name: 1,
      });
  }

  async search(keyword: string) {
    const filter: FilterQuery<ICategory> = {
      isDeleted: false,
      $or: [
        {
          name: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          description: {
            $regex: keyword,
            $options: "i",
          },
        },
      ],
    };

    return this.model.find(filter).sort({
      sortOrder: 1,
      createdAt: -1,
    });
  }

  async paginate(
    page: number,
    limit: number,
    search?: string,
    status?: Status
  ) {
    const filter: FilterQuery<ICategory> = {
      isDeleted: false,
    };

    if (status) {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          description: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.model
        .find(filter)
        .sort({
          sortOrder: 1,
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit),

      this.model.countDocuments(filter),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async updateStatus(
    id: string,
    status: Status
  ) {
    return this.model.findByIdAndUpdate(
      id,
      {
        status,
      },
      {
        new: true,
      }
    );
  }
}