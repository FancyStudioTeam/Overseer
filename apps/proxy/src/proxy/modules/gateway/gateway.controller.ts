import { randomUUID } from "node:crypto";
import { PresenceStatus, type StatusUpdate } from "@discordeno/bot";
import { withResolvers } from "@functions/withResolvers.js";
import { GatewayManager } from "@managers/GatewayManager.js";
import { Body, Controller, Post, Response, UsePipes } from "@nestjs/common";
import { ZodValidationPipe } from "@proxy/common/pipes/ZodValidation.js";
import { type ShardInformation, WorkerMessageType, type WorkerShardInformation } from "@util/types.js";
import { shardInformationRequestsCollection, workersCollection } from "@workers/index.js";
import type { FastifyReply } from "fastify";
import { match } from "ts-pattern";
import { PayloadSchema, type PayloadSchemaDto, PayloadType } from "./schemas/PayloadSchema.js";

const PresenceStatusLabels: Record<PresenceStatus, PresenceStatusLabel> = {
  [PresenceStatus.dnd]: "dnd",
  [PresenceStatus.idle]: "idle",
  [PresenceStatus.offline]: "offline",
  [PresenceStatus.online]: "online",
};

@Controller("gateway")
export class GatewayController {
  @Post()
  @UsePipes(new ZodValidationPipe(PayloadSchema))
  handleIncomingPayload(@Body() body: PayloadSchemaDto, @Response() response: FastifyReply): unknown {
    return match(body)
      .with(
        {
          type: PayloadType.PresenceUpdate,
        },
        async ({ payload }) => {
          const { activities, status } = payload;
          const statusPayload: StatusUpdate = {
            activities,
            status: PresenceStatusLabels[status],
          };

          await GatewayManager.editBotStatus(statusPayload);

          response.status(200);

          return;
        },
      )
      .with(
        {
          type: PayloadType.RequestShardInformation,
        },
        async ({ payload }) => {
          const { guild_id: guildId } = payload;
          const shardId = guildId ? GatewayManager.calculateShardId(guildId) : 0;
          const workerId = GatewayManager.calculateWorkerId(shardId);
          const worker = workersCollection.get(workerId);

          if (!worker) {
            response.status(404);

            return `Cannot get worker with id ${workerId}.`;
          }

          const nonce = randomUUID();
          const { promise, resolve } = withResolvers<ShardInformation>();
          const requestShardInformationMessage: WorkerShardInformation = {
            type: WorkerMessageType.RequestShardInformation,
            nonce,
            shardId,
          };

          shardInformationRequestsCollection.set(nonce, resolve);
          worker.postMessage(requestShardInformationMessage);

          const shardInformation = await promise;
          const { rtt, shardId: receivedShardId } = shardInformation;

          response.status(200);

          return {
            rtt,
            // biome-ignore lint/style/useNamingConvention: Properties should be in snake case.
            shard_id: receivedShardId,
          };
        },
      );
  }
}

await GatewayManager.spawnShards();

type PresenceStatusLabel = keyof typeof PresenceStatus;
