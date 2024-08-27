import { LoggerType, logger } from "#util/Util.js";

process.on("uncaughtException", (error) =>
  logger(`Uncaught Exception: ${error.stack ?? error.message}`, {
    type: LoggerType.ERROR,
  }),
);
