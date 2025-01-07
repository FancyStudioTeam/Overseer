import type { GatewayManager } from "@discordeno/bot";
import { logger } from "@util/logger.js";
import { workersCollection } from "@workers/index.js";
import {
  type WorkerEditShardsPresenceMessage,
  type WorkerIdentifyShardMessage,
  WorkerMessageTypes,
  type WorkerShardPayloadMessage,
} from "@workers/types.js";
import { createWorker } from "@workers/utils/createWorker.js";

export const overrideGateway = (gateway: GatewayManager) => {
  // biome-ignore lint/suspicious/useAwait:
  gateway.editBotStatus = async (payload) => {
    const workers = [...workersCollection.values()];

    logger.info(`Sending presence update to ${workers.length} workers...`);

    for (const worker of workers) {
      worker.postMessage({
        payload,
        type: WorkerMessageTypes.EditShardsPresence,
      } satisfies WorkerEditShardsPresenceMessage);
    }
  };

  // biome-ignore lint/suspicious/useAwait:
  gateway.sendPayload = async (shardId, payload) => {
    logger.info(`Sending payload to shard ${shardId}...`);

    const workerId = gateway.calculateWorkerId(shardId);
    const worker = workersCollection.get(workerId);

    if (!worker) {
      logger.warn(`Worker ${workerId} not found, ignoring payload...`);

      return;
    }

    worker.postMessage({
      payload,
      shardId,
      type: WorkerMessageTypes.ShardPayload,
    } satisfies WorkerShardPayloadMessage);
  };

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
