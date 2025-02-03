import { Module } from "@nestjs/common";
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { HttpExceptionFilter } from "@proxy/common/filters/HttpExceptionFilter.js";
import { AuthorizationGuard } from "@proxy/common/guards/AuthorizationGuard.js";
import { LoggerInterceptor } from "@proxy/common/interceptors/LoggerInterceptor.js";
import { AppController } from "./app.controller.js";
import { GatewayModule } from "./gateway/gateway.module.js";
import { RestModule } from "./rest/rest.module.js";

@Module({
  controllers: [AppController],
  imports: [GatewayModule, RestModule],
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
