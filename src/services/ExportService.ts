import BaseService from "@/services/BaseService";

import ExportRepository from "@/repositories/ExportRepository";
import {
  IExport,
} from "@/models/Export";

import {
  saveExportFile,
  readExportFile,
  deleteExportFile,
  exportFileExists,
} from "@/lib/storage";

interface CreateExportInput {
  fileName: string;

  fileType:
    | "csv"
    | "xlsx"
    | "pdf";

  module: string;

  createdBy: string;

  buffer: Buffer;
}

export default class ExportService
  extends BaseService<IExport>
{
  private readonly exportRepository: ExportRepository;

  constructor() {
    const repository =
      new ExportRepository();

    super(repository);

    this.exportRepository =
      repository;
  }

  /* =========================
     CREATE EXPORT
  ========================== */

  async createExport(
    data: CreateExportInput
  ) {
    const {
      fileName,
      fileType,
      module,
      createdBy,
      buffer,
    } = data;

    const storedFile =
      await saveExportFile(
        module,
        fileName,
        buffer
      );

    try {
      const exportRecord =
        await this.exportRepository.create(
          {
            fileName,
            fileType,
            module,
            storageKey:
              storedFile.storageKey,
            fileSize:
              storedFile.fileSize,
            createdBy,
            status: "completed",
          } as Partial<IExport>
        );

      return exportRecord;

    } catch (error) {
      await deleteExportFile(
        storedFile.storageKey
      );

      throw error;
    }
  }

  /* =========================
     GET BY MODULE
  ========================== */

  async findByModule(
    module: string
  ) {
    return this.exportRepository
      .findByModule(module);
  }

  /* =========================
     GET BY USER
  ========================== */

  async findByUser(
    createdBy: string
  ) {
    return this.exportRepository
      .findByUser(createdBy);
  }

  /* =========================
     GET COMPLETED
  ========================== */

  async findCompleted() {
    return this.exportRepository
      .findCompleted();
  }

  /* =========================
     GET RECENT
  ========================== */

  async findRecent(
    limit = 20
  ) {
    return this.exportRepository
      .findRecent(limit);
  }

  /* =========================
     READ FILE
  ========================== */

  async readFile(
    storageKey: string
  ) {
    return readExportFile(
      storageKey
    );
  }

  /* =========================
     FILE EXISTS
  ========================== */

  async fileExists(
    storageKey: string
  ) {
    return exportFileExists(
      storageKey
    );
  }

  /* =========================
     DELETE EXPORT
  ========================== */

  async deleteExport(
    id: string
  ) {
    const exportRecord =
      await this.exportRepository.findById(
        id
      );

    if (!exportRecord) {
      return null;
    }

    await deleteExportFile(
      exportRecord.storageKey
    );

    return this.exportRepository.softDelete(
      id
    );
  }
}