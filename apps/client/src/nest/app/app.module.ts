import { type MiddlewareConsumer, Module, type NestModule } from "@nestjs/common";
import { LoggerMiddleware } from "../middlewares/logger.middleware.js";
import { AppController } from "./app.controller.js";

@Module({
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("*");
  }
}
