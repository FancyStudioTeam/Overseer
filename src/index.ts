import "dotenv/config";
import { init } from "@sentry/node";
import { User } from "oceanic.js";
import { Discord } from "#client";
import { version } from "#package";

export const client = new Discord();

init({
  dsn: process.env.SENTRY_DSN_URL,
  _experiments: {
    metricsAggregator: true,
  },
  release: version,
  tracesSampleRate: 0.5,
});

Object.defineProperty(User.prototype, "name", {
  get: function () {
    return this.globalName ?? this.username;
  },
});
