import { Injectable, type NestMiddleware } from "@nestjs/common";
import { logger } from "@util/logger.js";
import type { FastifyReply, FastifyRequest } from "fastify";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(request: FastifyRequest, _response: FastifyReply, next: () => void) {
    logger.http(`Received "${request.method}" request to "${request.url}" from "${request.ip}".`);

    next();
  }
}
