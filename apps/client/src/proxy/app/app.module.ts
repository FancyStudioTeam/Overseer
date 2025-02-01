import { type MiddlewareConsumer, Module, type NestModule } from "@nestjs/common";
import { LoggerMiddleware } from "@proxy/middlewares/logger.middleware.js";
import { AppController } from "./app.controller.js";

@Module({
  /** Import the application controllers. */
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    /** Apply these middlewares to all routes using a wildcard. */
    consumer.apply(LoggerMiddleware).forRoutes("*");
  }
}
