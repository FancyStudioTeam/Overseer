import type { RequestMethods } from "@discordeno/bot";
import { RestManager } from "@managers/RestManager.js";
import { logger } from "@util/Logger.js";
import type { FastifyInstance, FastifyPluginOptions } from "fastify";

const transformRoute = (url: string) => {
  const toArray = url.split("/").filter(Boolean);
  const route = toArray.slice(2).join("/");

  return `/${route}`;
};

export const RestRoutes = (app: FastifyInstance, _options: FastifyPluginOptions) => {
  app.all("/*", async (request, response) => {
    try {
      const route = transformRoute(request.originalUrl);
      const method = request.method as RequestMethods;
      const apiRequest = await RestManager.makeRequest(method, route, {
        body: request.body,
      });
      const { body, status } = {
        body: apiRequest ?? {},
        status: apiRequest ? 200 : 204,
      };

      return response.status(status).send(body);
    } catch (internalError) {
      const error = internalError instanceof Error ? internalError : new Error(String(internalError));

      logger.error(error.stack);

      return response.status(500).send({
        message: "Internal Server Error",
      });
    }
  });
};
