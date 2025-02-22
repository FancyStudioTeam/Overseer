import { type GatewayManager, delay } from "@discordeno/bot";
import { withResolvers } from "@functions/withResolvers.js";
import { logger } from "@util/logger.js";
import {
  type ParentPortMessage,
  ParentPortMessageType,
  type WorkerIdentifyShard,
  WorkerMessageType,
  type WorkerPresenceUpdate,
} from "@util/types.js";
import { createWorker } from "@workers/functions/createWorker.js";
import { workersCollection } from "@workers/index.js";

/**
 * Overrides the default behavior of the gateway manager.
 * @param gatewayManager - The gateway manager instance to override.
 */
export const overrideGatewayManager = (gatewayManager: GatewayManager): void => {
  const { spawnShardDelay } = gatewayManager;

  // biome-ignore lint/suspicious/useAwait: To avoid type conflicts.
  gatewayManager.editBotStatus = async (payload) => {
    const allWorkers = workersCollection.values();

    for (const worker of allWorkers) {
      const presenceUpdateMessage: WorkerPresenceUpdate = {
        type: WorkerMessageType.PresenceUpdate,
        payload,
      };

      worker.postMessage(presenceUpdateMessage);
    }
  };

  gatewayManager.tellWorkerToIdentify = async (workerId, shardId) => {
    logger.shard(`Requesting Worker ${workerId} to identify Shard ${shardId}...`);

    const worker = workersCollection.get(workerId) ?? createWorker(workerId);
    const identigyShardMessage: WorkerIdentifyShard = {
      shardId,
      type: WorkerMessageType.IdentifyShard,
    };

    /** Send a message to the parent port to identify the shard. */
    worker.postMessage(identigyShardMessage);
    workersCollection.set(workerId, worker);

    const { promise, resolve } = withResolvers<void>();
    const waitForShardIdentify = (message: ParentPortMessage) => {
      const { type, shardId: messageShardId } = message;

      if (type === ParentPortMessageType.ShardIdentified && messageShardId === shardId) {
        resolve();
      }
    };

    worker.on("message", waitForShardIdentify);

    await promise;

    worker.off("message", waitForShardIdentify);

    await delay(spawnShardDelay);
  };
};
