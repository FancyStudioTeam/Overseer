import {
  type CanActivate,
  type ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { EVENTS_ALLOWED_IPS, EVENTS_AUTHORIZATION } from "@util/config.js";
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

    if (!EVENTS_ALLOWED_IPS.includes(ip)) {
      throw new ForbiddenException();
    }

    if (authorization !== EVENTS_AUTHORIZATION) {
      throw new UnauthorizedException();
    }

    /** Return "true" to allow the request to continue. */
    return true;
  }
}
