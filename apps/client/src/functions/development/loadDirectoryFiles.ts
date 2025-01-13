import { type Path, glob } from "glob";

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
