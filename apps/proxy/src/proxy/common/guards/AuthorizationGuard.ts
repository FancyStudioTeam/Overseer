import {
  type CanActivate,
  type ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { PROXY_ALLOWED_IPS, PROXY_AUTHORIZATION } from "@util/config.js";
import type { FastifyRequest } from "fastify";

@Injectable()
export class AuthorizationGuard implements CanActivate {
  /**
   * Checks whether the request is authorized.
   * @param context - The execution context object.
   * @returns Whether the request is authorized.
   */
  canActivate(context: ExecutionContext): boolean {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<FastifyRequest>();
    const { headers, ip } = request;
    const { authorization } = headers;

    /** All exceptions will be handled by the "HttpExceptionFilter" filter. */
    if (!PROXY_ALLOWED_IPS.includes(ip)) {
      throw new ForbiddenException();
    }

    if (authorization !== PROXY_AUTHORIZATION) {
      throw new UnauthorizedException();
    }

    /** Return "true" to allow the request to continue. */
    return true;
  }
}
