import { type ArgumentsHost, Catch, type ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { logger } from "@util/logger.js";
import type { FastifyReply } from "fastify";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const httpContext = host.switchToHttp();
    const response = httpContext.getResponse<FastifyReply>();
    const statusCode = exception.getStatus();

    if (statusCode === HttpStatus.INTERNAL_SERVER_ERROR) {
      logger.error(exception.stack);
    }

    /** Send an empty response with the received status code. */
    response.status(statusCode).send();
  }
}
