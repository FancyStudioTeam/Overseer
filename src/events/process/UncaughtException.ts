import { LoggerType, logger } from "@utils";

process.on("uncaughtException", (error) =>
  logger(`Uncaught Exception: ${error.stack ?? error.message}`, {
    type: LoggerType.ERROR,
  }),
);
