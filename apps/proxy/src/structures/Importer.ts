export class Importer {
  /** Imports all modules and files to work with. */
  async init() {
    await Promise.all([this.importProxyServer()]);
  }

  /** Imports the proxy server. */
  async importProxyServer() {
    await import("@proxy/index.js");
  }
}
