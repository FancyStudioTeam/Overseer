import type { GatewayManager } from "@discordeno/bot";
import { workersCollection } from "@workers/index.js";
import { type WorkerIdentifyShardMessage, WorkerMessageTypes } from "@workers/types.js";
import { createWorker } from "@workers/utils/createWorker.js";

export const overrideGateway = (gateway: GatewayManager) => {
  // biome-ignore lint/suspicious/useAwait:
  gateway.tellWorkerToIdentify = async (workerId, shardId) => {
    const worker = workersCollection.get(workerId) ?? createWorker(workerId);

    workersCollection.set(workerId, worker);
    worker.postMessage({
      shardId,
      type: WorkerMessageTypes.IdentifyShard,
    } satisfies WorkerIdentifyShardMessage);
  };
};
