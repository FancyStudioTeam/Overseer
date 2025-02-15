export class Loader {
  /** Initializes the resources imports. */
  async initImports(): Promise<void> {
    await Promise.all([this.importProxyApplication()]);
  }

  /** Imports the Nest.js proxy application. */
  private async importProxyApplication(): Promise<void> {
    await import("@proxy/index.js");
  }
}
