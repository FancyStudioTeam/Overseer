import { EVENTS_ALLOWED_IPS, EVENTS_AUTHORIZATION } from "@config";
import {
  type CanActivate,
  type ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import type { FastifyRequest } from "fastify";

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(_context: ExecutionContext) {
    /** Change the host to a http context. */
    const context = _context.switchToHttp();
    const request = context.getRequest<FastifyRequest>();
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
