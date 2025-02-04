import { Module } from "@nestjs/common";
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { HttpExceptionFilter } from "@proxy/common/filters/HttpExceptionFilter.js";
import { AuthorizationGuard } from "@proxy/common/guards/AuthorizationGuard.js";
import { LoggerInterceptor } from "@proxy/common/interceptors/LoggerInterceptor.js";
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
      provide: APP_INTERCEPTOR,
      useClass: LoggerInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: AuthorizationGuard,
    },
  ],
})
export class AppModule {}
