export class Loader {
  /** Imports the Nest.js proxy application. */
  private async importProxyApplication(): Promise<void> {
    await import("@proxy/index.js");
  }

  /** Initializes the resource imports. */
  async initImports(): Promise<void> {
    await Promise.all([this.importProxyApplication()]);
  }
}
