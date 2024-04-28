import "dotenv/config";
import { Fancycord } from "./classes/Client";

export const _client = new Fancycord();

(async () => {
  await _client._init();
  _client.setMaxListeners(10);
})();
