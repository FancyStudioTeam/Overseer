import {
  type CanActivate,
  type ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { PROXY_ALLOWED_IPS } from "@util/config.js";
import type { FastifyRequest } from "fastify";

@Injectable()
export class AuthorizationGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<FastifyRequest>();
    const {
      headers: { authorization },
      ip,
    } = request;

    if (!PROXY_ALLOWED_IPS.includes(ip)) {
      throw new ForbiddenException();
    }

    if (authorization !== process.env.PROXY_AUTHORIZATION) {
      throw new UnauthorizedException();
    }

    /** Return "true" to allow the request to continue. */
    return true;
  }
}
