import "reflect-metadata";
import { EVENTS_HOST, EVENTS_PORT } from "@config";
import { NestFactory } from "@nestjs/core";
import { FastifyAdapter } from "@nestjs/platform-fastify";
import { logger } from "@util/logger.js";
import { AppModule } from "./app/app.module.js";
import { HttpExceptionFilter } from "./filters/httpException.filter.js";
import { AuthGuard } from "./guards/auth.guards.js";

/** Create a fastify adapter for Nest. */
const fastifyAdapter = new FastifyAdapter();
const app = await NestFactory.create(AppModule, fastifyAdapter, {
  /** Disable the default Nest logger. */
});

// biome-ignore lint/correctness/useHookAtTopLevel: Not a React hook.
app.useGlobalGuards(new AuthGuard());
// biome-ignore lint/correctness/useHookAtTopLevel: Not a React hook.
app.useGlobalFilters(new HttpExceptionFilter());

await app.listen(EVENTS_PORT, EVENTS_HOST, () => {
  const address = `http://localhost:${EVENTS_PORT}`;

  logger.http(`Initialized proxy server at address "${address}".`);
});
