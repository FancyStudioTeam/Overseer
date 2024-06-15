import "dotenv/config";
import { init } from "@sentry/node";
import { Discord } from "#client";
import { version } from "#package";

export const _client = new Discord();

init({
  dsn: process.env.SENTRY_DNS,
  _experiments: {
    metricsAggregator: true,
  },
  release: version,
  tracesSampleRate: 0.5,
});

const obj = {
  a: true,
  b: true,
  𐊧: true,
};
