import { logger } from "@util/logger.js";

process.on("unhandledRejection", (reason) => {
  /**
   * Reason is unknown, so transform it to an error instance and log its stack.
   */
  const error = reason instanceof Error ? reason : new Error(String(reason));

  logger.error(error.stack);
});
