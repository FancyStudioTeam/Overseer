import { LoggerType, logger } from "@utils";

process.on("unhandledRejection", (error) => {
  if (error instanceof Error) {
    logger(`Unhandled Rejection: ${error.stack ?? error.message}`, {
      type: LoggerType.ERROR,
    });
  }
});
