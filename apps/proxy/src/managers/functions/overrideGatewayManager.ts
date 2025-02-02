import type { GatewayManager } from "@discordeno/bot";
import { logger } from "@util/logger.js";
import { type WorkerIdentifyShard, WorkerMessageType } from "@util/types.js";
import { createWorker } from "@workers/functions/createWorker.js";
import { workersCollection } from "@workers/index.js";

/**
 * Overrides the default behavior of the gateway manager.
 * @param gatewayManager The gateway manager instance to override.
 * @returns Nothing.
 */
export const overrideGatewayManager = (gatewayManager: GatewayManager): void => {
  // biome-ignore lint/suspicious/useAwait: Required by the manager.
  gatewayManager.tellWorkerToIdentify = async (workerId, shardId, bucketId) => {
    logger.info(`Telling worker ${workerId} to identify shard ${shardId} from bucket ${bucketId}.`);

    const worker = workersCollection.get(workerId) ?? createWorker(workerId);
    const identigyShardMessage: WorkerIdentifyShard = {
      shardId,
      type: WorkerMessageType.IdentifyShard,
    };

    /** Send a message to the parent port to identify the shard. */
    worker.postMessage(identigyShardMessage);
    workersCollection.set(workerId, worker);
  };
};
