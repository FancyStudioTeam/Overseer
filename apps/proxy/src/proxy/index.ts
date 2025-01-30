import "reflect-metadata";
import { PROXY_HOST, PROXY_PORT } from "@config";
import fastifyHelmet from "@fastify/helmet";
import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, type NestFastifyApplication } from "@nestjs/platform-fastify";
import { logger } from "@util/logger.js";
import { HttpExceptionFilter } from "./common/filters/HttpExceptionFilter.js";
import { AppModule } from "./modules/app.module.js";

/** Create a fastify adapter for Nest. */
const fastifyAdapter = new FastifyAdapter();
const app = await NestFactory.create<NestFastifyApplication>(AppModule, fastifyAdapter, {
  cors: true,
  /** Disable the default Nest logger. */
  logger: false,
});

app.register(fastifyHelmet);
// biome-ignore lint/correctness/useHookAtTopLevel: Not a React hook.
app.useGlobalFilters(new HttpExceptionFilter());

await app.listen(PROXY_PORT, PROXY_HOST, async () => {
  const address = await app.getUrl();

  logger.http(`Initialized proxy server at address "${address}".`);
});
