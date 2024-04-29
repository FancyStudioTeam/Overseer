import "dotenv/config";
import { Discord } from "./classes/Client";

export const _client = new Discord();

(async () => {
  await _client._init();
  _client.setMaxListeners(10);
})();
