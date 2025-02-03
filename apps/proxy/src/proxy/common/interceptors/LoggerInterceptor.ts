import { type CallHandler, type ExecutionContext, Injectable, type NestInterceptor } from "@nestjs/common";
import { STATUS_CODE_LABELS } from "@util/constants.js";
import { logger } from "@util/logger.js";
import type { FastifyReply, FastifyRequest } from "fastify";
import { type Observable, tap } from "rxjs";

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<FastifyRequest>();
    const { ip, method, url } = request;

    logger.http(`Received a "${method}" request to "${url}" from "${ip}".`);

    return next.handle().pipe(
      tap(() => {
        const response = httpContext.getResponse<FastifyReply>();
        const { statusCode } = response;

        logger.http(`Sent a "${STATUS_CODE_LABELS[statusCode]}" response to "${url}".`);
      }),
    );
  }
}
