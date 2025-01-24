import type { DiscordGatewayPayload, GatewayDispatchEventNames } from "@discordeno/bot";
import { client } from "@index";
import { logger } from "@util/logger.js";
import type { FastifyInstance, FastifyPluginOptions } from "fastify";

export const Routes = (app: FastifyInstance, _options: FastifyPluginOptions) => {
  app.get("/timecheck", async (_request, response) => response.status(200).send(Date.now()));

  app.post("/", async (request, response) => {
    try {
      if (!request.body) {
        return response.status(400).send();
      }

      const { payload, shardId } = request.body as GatewayPayload;

      client.events.raw?.(payload, shardId);

      if (payload.t) {
        const eventName = payload.t as GatewayDispatchEventNames;

        await client.events.dispatchRequirements?.(payload, shardId);
        client.handlers[eventName]?.(client, payload, shardId);
      }

      return response.status(200).send();
    } catch (internalError) {
      const error = internalError instanceof Error ? internalError : new Error(String(internalError));

      logger.error(error.stack);

      return response.status(500).send();
    }
  });
};

interface GatewayPayload {
  payload: DiscordGatewayPayload;
  shardId: number;
}
