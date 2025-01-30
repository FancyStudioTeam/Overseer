import type { RequestMethods } from "@discordeno/bot";
import { RestManager } from "@managers/RestManager.js";
import { All, Body, Controller, HttpStatus, InternalServerErrorException, Request, Response } from "@nestjs/common";
import type { FastifyReply, FastifyRequest } from "fastify";

const PATH_REGEX = /^\/rest\/(.+)$/;

/**
 * Gets the request path from the fastify request object.
 * @param request The fastify request object.
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
  async handleDiscordRequest(
    @Body() discordRequestBody: unknown,
    @Request() request: FastifyRequest,
    @Response() response: FastifyReply,
  ) {
    try {
      const { method: rawMethod } = request;
      /** Get the Discord request path to create the request. */
      const path = getRequestPath(request);
      const method = rawMethod as RequestMethods;
      /** Create the request to the Discord API. */
      const discordRequest = await RestManager.makeRequest(method, path, {
        body: discordRequestBody,
      });
      /**
       * Check whether the request has any response object.
       * Discord request can be a response object or "undefined".
       */
      const body = discordRequest;
      const status = body ? HttpStatus.OK : HttpStatus.NO_CONTENT;

      return response.status(status).send(body);
    } catch (internalError) {
      throw new InternalServerErrorException(internalError);
    }
  }
}
