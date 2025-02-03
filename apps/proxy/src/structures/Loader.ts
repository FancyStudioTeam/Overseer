export class Loader {
  /**
   * Imports all modules and files to work.
   * @returns Nothing.
   */
  async initImports(): Promise<void> {
    await Promise.all([this.importProxyApplication()]);
  }

  /**
   * Imports the Nest.js proxy application.
   * @returns Nothing.
   */
  private async importProxyApplication(): Promise<void> {
    await import("@proxy/index.js");
  }
}
