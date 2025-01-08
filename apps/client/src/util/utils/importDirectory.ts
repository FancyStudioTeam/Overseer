import { readdir } from "node:fs/promises";
import { resolve } from "node:path";

export const importDirectory = async (directory: string) => {
  const allFiles = await readdir(directory, {
    recursive: true,
    withFileTypes: true,
  });
  const filteredFiles = allFiles.filter(
    (file) => file.isFile() && (file.name.endsWith(".js") || file.name.endsWith(".ts")),
  );
  const resolvedFilePaths = filteredFiles.map((file) => `file://${resolve(file.parentPath, file.name)}`);

  resolvedFilePaths.map(async (filePath) => await import(filePath));
};
