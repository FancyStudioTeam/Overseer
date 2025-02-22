import { type Worker, workerData as nodeWorkerData, parentPort } from "node:worker_threads";
import { Collection, type DiscordenoShard, GatewayOpcodes, type ShardSocketRequest } from "@discordeno/bot";
import { logger } from "@util/logger.js";
import {
  ParentPortMessageType,
  type ParentPortShardIdentified,
  type ShardInformation,
  type WorkerDataOptions,
  type WorkerMessage,
  WorkerMessageType,
} from "@util/types.js";
import { match } from "ts-pattern";
import { createShard } from "./functions/createShard.js";

export const identifyPromisesCollection = new Collection<number, IdentifyPromise>();
export const shardInformationRequestsCollection = new Collection<string, ShardInformationPromise>();
export const shardsCollection = new Collection<number, DiscordenoShard>();
export const workersCollection = new Collection<number, Worker>();
export const workerData: WorkerDataOptions = nodeWorkerData;

/** Handle all incoming worker messages. */
parentPort?.on("message", (workerMessage: WorkerMessage) =>
  match(workerMessage)
    .with(
      {
        type: WorkerMessageType.AllowIdentify,
      },
      ({ shardId }) => {
        const identifyPromise = identifyPromisesCollection.get(shardId);

        if (identifyPromise) {
          identifyPromise();
          identifyPromisesCollection.delete(shardId);
        }
      },
    )
    .with(
      {
        type: WorkerMessageType.IdentifyShard,
      },
      async ({ shardId }) => {
        const shard = shardsCollection.get(shardId) ?? createShard(shardId);
        const { id } = shard;
        const shardIdentifiedMessage: ParentPortShardIdentified = {
          shardId,
          type: ParentPortMessageType.ShardIdentified,
        };

        shardsCollection.set(id, shard);
        await shard.identify();
        /** Send a message to the worker to tell the worker that the shard was identified. */
        parentPort?.postMessage(shardIdentifiedMessage);
      },
    )
    .with(
      {
        type: WorkerMessageType.PresenceUpdate,
      },
      async ({ payload }) => {
        const allShards = shardsCollection.values();
        const sendPayloadPromises = allShards.map(async (shard) => {
          const { id } = shard;
          const { activities, status } = payload;
          const presenceUpdatePayload: ShardSocketRequest = {
            d: {
              activities,
              afk: false,
              since: null,
              status,
            },
            op: GatewayOpcodes.PresenceUpdate,
          };

          logger.shard(`Sending presence update payload to shard ${id}...`);

          await shard.send(presenceUpdatePayload);
        });

        await Promise.all(sendPayloadPromises);
      },
    ),
);

type IdentifyPromise = () => void;
type ShardInformationPromise = (value: ShardInformation) => void;
