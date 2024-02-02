import "dotenv/config";
import { Fancycord } from "./classes/Client";
import { LogType } from "./types";
import { logger } from "./util/util";

export const client = new Fancycord();

(async () => {
  await client.init();
})();

process.on("uncaughtException", (error: Error) => {
  logger(`Uncaught Exception: ${error.stack}`, LogType.Error);
});

process.on("uncaughtExceptionMonitor", (error: Error) => {
  logger(`Uncaught Exception Monitor: ${error.stack}`, LogType.Error);
});
