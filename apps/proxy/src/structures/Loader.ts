export class Loader {
  /** Initializes the resource imports. */
  async _init(): Promise<void> {
    await Promise.all([this.importProxyApplication()]);
  }

  /** Imports the Nest.js proxy application. */
  private async importProxyApplication(): Promise<void> {
    await import("@proxy/index.js");
  }
}
