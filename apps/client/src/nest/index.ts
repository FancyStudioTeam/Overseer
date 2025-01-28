import "reflect-metadata";
import { EVENTS_HOST, EVENTS_PORT } from "@config";
import { NestFactory } from "@nestjs/core";
import { FastifyAdapter } from "@nestjs/platform-fastify";
import { AppModule } from "./app/app.module.js";
import { HttpExceptionFilter } from "./filters/httpException.filter.js";

/** Create a fastify adapter for Nest. */
const fastifyAdapter = new FastifyAdapter();
const app = await NestFactory.create(AppModule, fastifyAdapter, {
  /** Disable the default Nest logger. */
  logger: false,
});

// biome-ignore lint/correctness/useHookAtTopLevel: Not a React hook.
app.useGlobalFilters(new HttpExceptionFilter());

await app.listen(EVENTS_PORT, EVENTS_HOST);
