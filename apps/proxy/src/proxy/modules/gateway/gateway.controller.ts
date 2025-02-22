import { randomUUID } from "node:crypto";
import { PresenceStatus, type StatusUpdate } from "@discordeno/bot";
import { withResolvers } from "@functions/withResolvers.js";
import { GatewayManager } from "@managers/GatewayManager.js";
import { Body, Controller, InternalServerErrorException, Post, Response, UsePipes } from "@nestjs/common";
import { ZodValidationPipe } from "@proxy/common/pipes/ZodValidation.js";
import { type ShardInformation, WorkerMessageType, type WorkerShardInformation } from "@util/types.js";
import { shardInformationRequestsCollection, workersCollection } from "@workers/index.js";
import type { FastifyReply } from "fastify";
import { match } from "ts-pattern";
import { PayloadSchema, type PayloadSchemaDto, PayloadType } from "./schemas/PayloadSchema.js";
import {
  RequestShardInformationSchema,
  type RequestShardInformationSchemaDto,
} from "./schemas/RequestShardInformation.js";

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
  handleIncomingPayload(
    @Body() incomingPayloadBody: PayloadSchemaDto,
    @Response() response: FastifyReply,
  ): Promise<FastifyReply> {
    try {
      return match(incomingPayloadBody)
        .returnType<Promise<FastifyReply>>()
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

            return response.status(200).send();
          },
        )
        .run();
    } catch (internalError) {
      throw new InternalServerErrorException(internalError);
    }
  }

  @Post("information")
  @UsePipes(new ZodValidationPipe(RequestShardInformationSchema))
  async requestShardInformation(
    @Body() requestShardInformationBody: RequestShardInformationSchemaDto,
    @Response() response: FastifyReply,
  ): Promise<FastifyReply> {
    try {
      const { guild_id: guildId } = requestShardInformationBody;
      const shardId = guildId ? GatewayManager.calculateShardId(guildId) : 0;
      const workerId = GatewayManager.calculateWorkerId(shardId);
      const worker = workersCollection.get(workerId);

      if (!worker) {
        return response.status(404).send();
      }

      const nonce = randomUUID();
      const { promise, resolve } = withResolvers<ShardInformation>();
      const requestShardInformationMessage: WorkerShardInformation = {
        type: WorkerMessageType.RequestShardInformation,
        nonce,
        shardId,
      };

      shardInformationRequestsCollection.set(nonce, resolve);
      /** Send a message to the parent port to request the shard information. */
      worker.postMessage(requestShardInformationMessage);

      const shardInformation = await promise;
      const { rtt, shardId: receivedShardId } = shardInformation;

      return response.status(200).send({
        rtt,
        // biome-ignore lint/style/useNamingConvention: Properties should be in snake case.
        shard_id: receivedShardId,
      });
    } catch (internalError) {
      throw new InternalServerErrorException(internalError);
    }
  }
}

await GatewayManager.spawnShards();

type PresenceStatusLabel = keyof typeof PresenceStatus;
