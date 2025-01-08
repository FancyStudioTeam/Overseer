import { PrismaClient } from "@prisma/client";
import { logger } from "./logger.js";

export const prisma = new PrismaClient({
  log: [
    {
      emit: "event",
      level: "query",
    },
  ],
});

prisma.$on("query", ({ duration, params, query }) =>
  logger.info(`Sent Prisma query to MongoDB: "${query}" with params "${params}". Took ${duration} milliseconds.`),
);
