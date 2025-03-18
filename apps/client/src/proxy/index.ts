import "reflect-metadata";
import fastifyCsrf from "@fastify/csrf-protection";
import fastifyHelmet from "@fastify/helmet";
import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, type NestFastifyApplication } from "@nestjs/platform-fastify";
import { EVENTS_HOST, EVENTS_PORT } from "@util/config.js";
import { logger } from "@util/logger.js";
import { AppModule } from "./modules/app.module.js";

/**
 * Create a Fastify adapter for Nest.js.
 * This adapter will use Fastify for Nest.js.
 */
const fastifyAdapter = new FastifyAdapter();
// @ts-expect-error
const app = await NestFactory.create<NestFastifyApplication>(AppModule, fastifyAdapter, {
  cors: true,
  logger: false,
});

await app.register(fastifyHelmet);
await app.register(fastifyCsrf);

await app.listen(EVENTS_PORT, EVENTS_HOST, async () => {
  const address = await app.getUrl();

  logger.info(`Initialized proxy server at address "${address}".`);
});
