import "dotenv/config";
import { init } from "@sentry/node";
import { Discord } from "#client";

export const _client = new Discord();

init({
  dsn: process.env.SENTRY_DNS,
  _experiments: {
    metricsAggregator: true,
  },
});

(async () => {
  await _client._init();
  _client.setMaxListeners(10);
})();
