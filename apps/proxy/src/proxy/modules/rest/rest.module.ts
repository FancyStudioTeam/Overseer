import { Module } from "@nestjs/common";
import { RestController } from "./rest.controller.js";

@Module({
  controllers: [RestController],
})
export class RestModule {}
