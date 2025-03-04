import type { RequestMethods } from "@discordeno/bot";
import type { MultipartFile, MultipartValue } from "@fastify/multipart";
import { RestManager } from "@managers/RestManager.js";
import { All, Controller, HttpStatus, InternalServerErrorException, Request, Response, UsePipes } from "@nestjs/common";
import { ZodValidationPipe } from "@proxy/common/pipes/ZodValidation.js";
import type { FastifyReply, FastifyRequest } from "fastify";
import { RequestSchema } from "./schemas/RequestSchema.js";

const PATH_REGEX = /^\/?(?:rest\/|v10\/)*(.+)$/;

/**
 * Parses a multipart body into a form data object.
 * @param body - The request body.
 * @returns The created form data.
 */
const parseMultipartBody = async (body: unknown): Promise<FormData> => {
  const form = new FormData();

  if (typeof body !== "object" || !body) {
    return form;
  }

  for (const objectValue of Object.values(body)) {
    const value = objectValue as MultipartFile | MultipartValue;
    const { type: valueType } = value;

    if (valueType === "file") {
      const { fieldname, filename } = value;
      const valueToBuffer = await value.toBuffer();
      const valueToBlob = new Blob([valueToBuffer]);

      form.append(fieldname, valueToBlob, filename);
    }

    if (value.type === "field" && typeof value.value === "string") {
      const { fieldname, value: _value } = value;

      form.append(fieldname, _value);
    }
  }

  return form;
};

/**
 * Checks whether the request has a body.
 * @param method - The request method.
 * @returns Whether the request has a body.
 */
const requestHasBody = (method: RequestMethods): boolean => method !== "GET" && method !== "DELETE";

/**
 * Gets the request body from the Fastify request object.
 * @param request - The Fastify request object.
 * @returns The request body.
 */
const getRequestBody = async (request: FastifyRequest): Promise<unknown> => {
  const { body, headers, method: rawMethod } = request;
  const method = rawMethod as RequestMethods;
  const isMultipartBody = headers["content-type"]?.includes("multipart/form-data");
  const hasBody = requestHasBody(method);

  if (hasBody) {
    if (isMultipartBody) {
      const parsedMultipartBody = await parseMultipartBody(body);

      return parsedMultipartBody;
    }

    return body;
  }

  return undefined;
};
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
    @Request() request: FastifyRequest,
    @Response() response: FastifyReply,
  ): Promise<FastifyReply> {
    try {
      const { method: rawMethod } = request;
      const path = getRequestPath(request);
      const method = rawMethod as RequestMethods;
      const requestBody = await getRequestBody(request);
      const discordRequest = await RestManager.makeRequest(method, path, {
        body: requestBody,
      });
      /**
       * Use the received value from the Discord request.
       * Discord request can be a response object or "undefined".
       */
      const responseBody = discordRequest;
      /**
       * If the body is an object, return the status code "200".
       * Otherwise, return the status code "204".
       */
      const status = responseBody ? HttpStatus.OK : HttpStatus.NO_CONTENT;

      return response.status(status).send(responseBody);
    } catch (internalError) {
      throw new InternalServerErrorException(internalError);
    }
  }
}
