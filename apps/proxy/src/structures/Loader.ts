import { join, resolve } from "node:path";
import { type Path, glob } from "glob";

const __dirname = import.meta.dirname;
const distFolderPath = join(__dirname, "..");

export class Loader {
  /** Initializes the resources imports. */
  async initImports(): Promise<void> {
    await Promise.all([this.importEvents(), this.importProxyApplication()]);
  }

  /** Imports the events files. */
  private async importEvents(): Promise<void> {
    const eventsPattern = `${join(distFolderPath, "events")}/**/*.event.{js,ts}`;
    const loadedEventPaths = await this.loadDirectoryFiles(eventsPattern);
    const resolvedEventPaths = loadedEventPaths.map((eventPath) => this.resolvePath(eventPath));

    resolvedEventPaths.forEach(async (eventPath, _) => await import(eventPath));
  }

  /** Imports the Nest.js proxy application. */
  private async importProxyApplication(): Promise<void> {
    await import("@proxy/index.js");
  }

  /**
   * Creates a compatible path from a given Glob path to import.
   * @param path - The Glob path object to resolve.
   * @returns The resolved path.
   */
  private resolvePath(path: Path): string {
    return `file://${resolve(path.parentPath, path.name)}`;
  }

  /**
   * Loads all the files from a given Glob pattern.
   * @param pattern - The pattern to load the files from.
   * @returns The loaded Glob path files.
   */
  private async loadDirectoryFiles(pattern: string | string[]): Promise<Path[]> {
    const loadedPaths = await glob(pattern, {
      ignore: ["node_modules"],
      withFileTypes: true,
    });
    const filteredFiles = loadedPaths.filter(
      (file) => file.isFile() && (file.name.endsWith(".js") || file.name.endsWith(".ts")),
    );

    return filteredFiles;
  }
}
