import { type ArgumentsHost, Catch, type ExceptionFilter, HttpException } from "@nestjs/common";
import type { FastifyReply } from "fastify";

/** Handle all Nest http exception instances. */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    /** Change the host to a http context. */
    const context = host.switchToHttp();
    const response = context.getResponse<FastifyReply>();
    /** Get the status code from the exception. */
    const statusCode = exception.getStatus();

    /** Send an empty response with the status code. */
    response.status(statusCode).send();
  }
}
