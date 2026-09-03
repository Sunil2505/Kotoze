import fs from "fs/promises";
import path from "path";

const STORAGE_ROOT =
  path.join(
    process.cwd(),
    "storage",
    "exports"
  );

/* =========================
   STORAGE RESULT
========================= */

export interface StoredFile {
  storageKey: string;
  filePath: string;
  fileSize: number;
}

/* =========================
   ENSURE DIRECTORY
========================= */

async function ensureDirectory(
  directory: string
) {
  await fs.mkdir(
    directory,
    {
      recursive: true,
    }
  );
}

/* =========================
   SAVE FILE
========================= */

export async function saveExportFile(
  module: string,
  fileName: string,
  buffer: Buffer
): Promise<StoredFile> {
  const safeModule =
    sanitizeSegment(module);

  const safeFileName =
    sanitizeFileName(fileName);

  const moduleDirectory =
    path.join(
      STORAGE_ROOT,
      safeModule
    );

  await ensureDirectory(
    moduleDirectory
  );

  const filePath =
    path.join(
      moduleDirectory,
      safeFileName
    );

  await fs.writeFile(
    filePath,
    buffer
  );

  const fileSize =
    buffer.length;

  const storageKey =
    path
      .relative(
        STORAGE_ROOT,
        filePath
      )
      .replace(
        /\\/g,
        "/"
      );

  return {
    storageKey,
    filePath,
    fileSize,
  };
}

/* =========================
   READ FILE
========================= */

export async function readExportFile(
  storageKey: string
): Promise<Buffer> {
  const filePath =
    resolveStoragePath(
      storageKey
    );

  return fs.readFile(
    filePath
  );
}

/* =========================
   DELETE FILE
========================= */

export async function deleteExportFile(
  storageKey: string
): Promise<void> {
  const filePath =
    resolveStoragePath(
      storageKey
    );

  try {
    await fs.unlink(
      filePath
    );
  } catch (error: any) {
    if (
      error?.code !==
      "ENOENT"
    ) {
      throw error;
    }
  }
}

/* =========================
   FILE EXISTS
========================= */

export async function exportFileExists(
  storageKey: string
): Promise<boolean> {
  const filePath =
    resolveStoragePath(
      storageKey
    );

  try {
    await fs.access(
      filePath
    );

    return true;
  } catch {
    return false;
  }
}

/* =========================
   RESOLVE STORAGE PATH
========================= */

function resolveStoragePath(
  storageKey: string
): string {
  const normalizedKey =
    storageKey
      .replace(
        /\\/g,
        "/"
      )
      .replace(
        /^\/+/,
        ""
      );

  const resolvedPath =
    path.resolve(
      STORAGE_ROOT,
      normalizedKey
    );

  const resolvedRoot =
    path.resolve(
      STORAGE_ROOT
    );

  if (
    resolvedPath !==
      resolvedRoot &&
    !resolvedPath.startsWith(
      `${resolvedRoot}${path.sep}`
    )
  ) {
    throw new Error(
      "Invalid storage key."
    );
  }

  return resolvedPath;
}

/* =========================
   SANITIZE MODULE
========================= */

function sanitizeSegment(
  value: string
): string {
  return (
    value
      .trim()
      .replace(
        /[^a-zA-Z0-9_-]/g,
        "-"
      )
      .replace(
        /-+/g,
        "-"
      )
      .replace(
        /^-+|-+$/g,
        ""
      )
      .toLowerCase() ||
    "general"
  );
}

/* =========================
   SANITIZE FILE NAME
========================= */

function sanitizeFileName(
  value: string
): string {
  const extension =
    path.extname(
      value
    );

  const baseName =
    path
      .basename(
        value,
        extension
      )
      .trim()
      .replace(
        /[^a-zA-Z0-9._-]/g,
        "-"
      )
      .replace(
        /-+/g,
        "-"
      )
      .replace(
        /^-+|-+$/g,
        ""
      );

  return `${
    baseName || "export"
  }${extension}`;
}