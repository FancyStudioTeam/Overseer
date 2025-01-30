import { Module } from "@nestjs/common";
import { AppController } from "./app.controller.js";
import { RestModule } from "./rest/rest.module.js";

@Module({
  controllers: [AppController],
  imports: [RestModule],
})
export class AppModule {}
