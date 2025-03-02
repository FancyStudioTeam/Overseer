import type { RequestMethods } from "@discordeno/bot";
import { RestManager } from "@managers/RestManager.js";
import {
  All,
  Body,
  Controller,
  HttpStatus,
  InternalServerErrorException,
  Request,
  Response,
  UsePipes,
} from "@nestjs/common";
import { ZodValidationPipe } from "@proxy/common/pipes/ZodValidation.js";
import type { FastifyReply, FastifyRequest } from "fastify";
import { RequestSchema, type RequestSchemaDto } from "./schemas/RequestSchema.js";

const PATH_REGEX = /^\/?(?:rest\/|v10\/)*(.+)$/;

/**
 * Gets the request path from the Fastify request object.
 * @param request - The Fastify request object.
 * @returns The request path.
 */
const getRequestPath = (request: FastifyRequest): string => {
  const { originalUrl } = request;
  const match = originalUrl.match(PATH_REGEX);

  if (!match) {
    throw new Error("Cannot get request path.");
  }

  return `/${match[1]}`;
};

@Controller("rest")
export class RestController {
  @All("*")
  @UsePipes(new ZodValidationPipe(RequestSchema))
  async createDiscordRequest(
    @Body() createDiscordRequestBody: RequestSchemaDto,
    @Request() request: FastifyRequest,
    @Response() response: FastifyReply,
  ): Promise<FastifyReply> {
    try {
      const { method: rawMethod } = request;
      const path = getRequestPath(request);
      const method = rawMethod as RequestMethods;
      const discordRequest = await RestManager.makeRequest(method, path, {
        body: createDiscordRequestBody,
      });
      /**
       * Use the returned value from the Discord request.
       * Discord request can be a response object or "undefined".
       */
      const body = discordRequest;
      /**
       * If the body is an object, return the status code "200".
       * Otherwise, return the status code "204".
       */
      const status = body ? HttpStatus.OK : HttpStatus.NO_CONTENT;

      return response.status(status).send(body);
    } catch (internalError) {
      throw new InternalServerErrorException(internalError);
    }
  }
}
