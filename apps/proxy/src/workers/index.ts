import { type Worker, workerData as nodeWorkerData, parentPort } from "node:worker_threads";
import { Collection, type DiscordenoShard } from "@discordeno/bot";
import { logger } from "@util/logger.js";
import { type WorkerDataOptions, type WorkerMessage, WorkerMessageType } from "@util/types.js";
import { match } from "ts-pattern";
import { createShard } from "./functions/createShard.js";

export const workersCollection = new Collection<number, Worker>();
export const shardsCollection = new Collection<number, DiscordenoShard>();
export const identifyPromisesCollection = new Collection<number, IdentifyPromise>();
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

        shardsCollection.set(id, shard);

        await shard.identify().then(() => logger.shard(`Shard ${id} was successfully identified.`));
      },
    ),
);

type IdentifyPromise = () => void;
