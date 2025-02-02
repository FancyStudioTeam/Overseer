import { Module } from "@nestjs/common";
import { GatewayController } from "./gateway.controller.js";

@Module({
  controllers: [GatewayController],
})
export class GatewayModule {}
