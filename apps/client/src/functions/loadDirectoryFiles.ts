import { type Path, glob } from "glob";

/**
 * Loads all files from a directory matching the provided pattern.
 * @param pattern The glob pattern to match the files.
 * @returns The loaded path files.
 */
export const loadDirectoryFiles = async (pattern: string | string[]): Promise<Path[]> => {
  const loadedPaths = await glob(pattern, {
    ignore: ["node_modules"],
    withFileTypes: true,
  });
  const filteredFiles = loadedPaths.filter(
    (file) => file.isFile() && (file.name.endsWith(".js") || file.name.endsWith(".ts")),
  );

  return filteredFiles;
};
