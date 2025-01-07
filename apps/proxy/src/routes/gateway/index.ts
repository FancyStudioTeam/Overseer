import { GatewayManager } from "@managers/GatewayManager.js";
import { logger } from "@util/logger.js";
import {
  type WorkerEditShardsPresenceMessage,
  WorkerMessageTypes,
  type WorkerShardPayloadMessage,
} from "@workers/types.js";
import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import { match } from "ts-pattern";

export const GatewayRoutes = (app: FastifyInstance, _options: FastifyPluginOptions) =>
  app.post("/", (request, response) => {
    try {
      if (!request.body) {
        return response.status(400).send();
      }

      const message = request.body as WorkerEditShardsPresenceMessage | WorkerShardPayloadMessage;

      match(message)
        .with(
          {
            type: WorkerMessageTypes.EditShardsPresence,
          },
          ({ payload }) => GatewayManager.editBotStatus(payload),
        )
        .with(
          {
            type: WorkerMessageTypes.ShardPayload,
          },
          ({ payload, shardId }) => GatewayManager.sendPayload(shardId, payload),
        );
    } catch (internalError) {
      const error = internalError instanceof Error ? internalError : new Error(String(internalError));

      logger.error(error.stack);

      return response.status(500).send();
    }
  });

await GatewayManager.spawnShards();
