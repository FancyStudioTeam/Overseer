import "reflect-metadata";
import fastifyCsrf from "@fastify/csrf-protection";
import fastifyHelmet from "@fastify/helmet";
import fastifyMultipart from "@fastify/multipart";
import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, type NestFastifyApplication } from "@nestjs/platform-fastify";
import { PROXY_HOST, PROXY_PORT } from "@util/config.js";
import { logger } from "@util/logger.js";
import { AppModule } from "./modules/app.module.js";

/**
 * Create a Fastify adapter for Nest.js.
 * This adapter will use Fastify instead of Express.
 */
const fastifyAdapter = new FastifyAdapter();
const app = await NestFactory.create<NestFastifyApplication>(AppModule, fastifyAdapter, {
  cors: true,
  logger: false,
});

await app.register(fastifyHelmet);
await app.register(fastifyCsrf);
await app.register(fastifyMultipart, {
  attachFieldsToBody: true,
});

await app.listen(PROXY_PORT, PROXY_HOST, async () => {
  const address = await app.getUrl();

  logger.info(`Initialized proxy server at address "${address}".`);
});
