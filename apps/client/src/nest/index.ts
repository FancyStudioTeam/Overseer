import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import type { NestFastifyApplication } from "@nestjs/platform-fastify";
import { AppModule } from "./app/app.module.js";

const app = await NestFactory.create<NestFastifyApplication>(AppModule, {
  logger: false,
});

await app.listen(8080);
