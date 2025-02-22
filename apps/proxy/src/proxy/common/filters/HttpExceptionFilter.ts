import { type ArgumentsHost, Catch, type ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { logger } from "@util/logger.js";
import type { FastifyReply } from "fastify";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  /**
   * Catches all the http exception instances.
   * @param exception - The exception instance to catch.
   * @param host - The arguments host object.
   */
  catch(exception: HttpException, host: ArgumentsHost): void {
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
