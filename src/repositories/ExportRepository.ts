import BaseRepository from "@/repositories/BaseRepository";

import Export, {
  IExport,
} from "@/models/Export";

export default class ExportRepository
  extends BaseRepository<IExport>
{
  constructor() {
    super(Export);
  }

  async findByModule(
    module: string
  ) {
    return this.model.find({
      module,
      isDeleted: false,
    });
  }

  async findByUser(
    createdBy: string
  ) {
    return this.model.find({
      createdBy,
      isDeleted: false,
    });
  }

  async findCompleted() {
    return this.model.find({
      status: "completed",
      isDeleted: false,
    });
  }

  async findRecent(
    limit = 20
  ) {
    return this.model
      .find({
        isDeleted: false,
      })
      .sort({
        createdAt: -1,
      })
      .limit(limit);
  }
}