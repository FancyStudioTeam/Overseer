import { Injectable, type NestMiddleware } from "@nestjs/common";
import { logger } from "@util/logger.js";
import type { FastifyReply, FastifyRequest } from "fastify";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(request: FastifyRequest, _response: FastifyReply, next: NextFunction) {
    const { ip, method, url } = request;

    logger.info(`Received "${method}" request to "${url}" from "${ip}".`);

    next();
  }
}

type NextFunction = () => void;
