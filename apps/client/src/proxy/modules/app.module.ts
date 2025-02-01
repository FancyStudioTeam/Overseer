import { type MiddlewareConsumer, Module, type NestModule } from "@nestjs/common";
import { APP_FILTER, APP_GUARD } from "@nestjs/core";
import { HttpExceptionFilter } from "@proxy/common/filters/HttpExceptionFilter.js";
import { AuthorizationGuard } from "@proxy/common/guards/AuthorizationGuard.js";
import { LoggerMiddleware } from "@proxy/common/middlewares/LoggerMiddleware.js";
import { AppController } from "./app.controller.js";
import { EventsModule } from "./events/events.module.js";

@Module({
  controllers: [AppController],
  imports: [EventsModule],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: AuthorizationGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    /** Apply the logger middleware to all routes. */
    consumer.apply(LoggerMiddleware).forRoutes("*");
  }
}
