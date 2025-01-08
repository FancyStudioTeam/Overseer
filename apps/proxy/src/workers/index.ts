import { type Worker, workerData as nodeWorkerData, parentPort } from "node:worker_threads";
import { Collection, type DiscordenoShard, GatewayOpcodes } from "@discordeno/bot";
import { logger } from "@util/logger.js";
import { match } from "ts-pattern";
import { type WorkerDataOptions, type WorkerMessage, WorkerMessageTypes } from "./types.js";
import { createShard } from "./utils/createShard.js";

export const workersCollection = new Collection<number, Worker>();
export const shardsCollection = new Collection<number, DiscordenoShard>();
export const identifyPromisesCollection = new Collection<number, IdentifyPromiseFunction>();
export const workerData: WorkerDataOptions = nodeWorkerData;

/**
 * Handles the main thread messages.
 */
parentPort?.on("message", async (message: WorkerMessage) =>
  match(message)
    .with(
      {
        type: WorkerMessageTypes.AllowIdentify,
      },
      ({ shardId }) => {
        const identifyPromise = identifyPromisesCollection.get(shardId);

        identifyPromise?.();
        identifyPromisesCollection.delete(shardId);
      },
    )
    .with(
      {
        type: WorkerMessageTypes.EditShardsPresence,
      },
      async ({ payload }) => {
        const shards = [...shardsCollection.values()];
        const shardPresenceUpdatePromises = shards.map(async (shard) => {
          logger.info(`Sending presence update to shard ${shard.id}...`);

          const { activities, status } = payload;

          return await shard.send({
            d: {
              activities,
              afk: true,
              since: null,
              status,
            },
            op: GatewayOpcodes.PresenceUpdate,
          });
        });

        await Promise.all(shardPresenceUpdatePromises);
      },
    )
    .with(
      {
        type: WorkerMessageTypes.IdentifyShard,
      },
      async ({ shardId }) => {
        const { workerId } = workerData;
        const shard = shardsCollection.get(shardId) ?? createShard(shardId);

        logger.info(`Identifying shard ${shard.id} from worker ${workerId}...`);
        shardsCollection.set(shard.id, shard);

        await shard.identify();
      },
    )
    .with(
      {
        type: WorkerMessageTypes.RequestShardInfo,
      },
      ({ shardId }) => {
        logger.info(`Requesting shard info for shard ${shardId}...`);

        const shard = shardsCollection.get(shardId);

        if (!shard) {
          logger.warn(`Shard ${shardId} not found, ignoring request...`);

          return;
        }

        // TODO: Send shard info to the manager
      },
    )
    .with(
      {
        type: WorkerMessageTypes.ShardPayload,
      },
      async ({ payload, shardId }) => {
        logger.info(`Received payload from shard ${shardId}...`);

        const shard = shardsCollection.get(shardId);

        if (!shard) {
          logger.warn(`Shard ${shardId} not found, ignoring payload...`);

          return;
        }

        await shard.send(payload);
      },
    )
    .otherwise((message) => logger.error(`Received unknown worker message: "${message}".`)),
);

type IdentifyPromiseFunction = () => void;
