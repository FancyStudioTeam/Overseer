import { getErrorInstance } from "@functions/getErrorInstance.js";
import { logger } from "@util/logger.js";

process.on("unhandledRejection", (reason) => {
  const { stack } = getErrorInstance(reason);

  logger.error("Unhandled Rejection: ", stack);
});
