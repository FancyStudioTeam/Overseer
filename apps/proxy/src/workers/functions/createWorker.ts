import { join } from "node:path";
import { Worker } from "node:worker_threads";
import { GatewayManager } from "@managers/GatewayManager.js";
import { EVENTS_AUTHORIZATION, EVENTS_URL, GATEWAY_INTENTS } from "@util/config.js";
import { logger } from "@util/logger.js";
import {
  type ParentPortMessage,
  ParentPortMessageType,
  type WorkerDataOptions,
  type WorkerMessage,
  WorkerMessageType,
} from "@util/types.js";
import { shardInformationRequestsCollection } from "@workers/index.js";
import { match } from "ts-pattern";

const __dirname = import.meta.dirname;

/**
 * Creates a new Node.js worker instance.
 * @param id - The worker id.
 * @returns The created worker instance.
 */
export const createWorker = (id: number): Worker => {
  const workerFilePath = join(__dirname, "..", "index.js");
  const { token, totalShards, url, version } = GatewayManager;
  const workerOptions: WorkerDataOptions = {
    eventsProxy: {
      authorization: EVENTS_AUTHORIZATION,
      url: EVENTS_URL,
    },
    gatewayConnection: {
      intents: GATEWAY_INTENTS,
      token,
      totalShards,
      url,
      version,
    },
    id,
  };
  const worker = new Worker(workerFilePath, {
    workerData: workerOptions,
  });

  /** Handle all incoming parent port messages. */
  worker.on("message", (parentPortMessage: ParentPortMessage) =>
    match(parentPortMessage)
      .with(
        {
          type: ParentPortMessageType.RequestIdentify,
        },
        async ({ shardId }) => {
          await GatewayManager.requestIdentify(shardId);

          const allowIdentifyMessage: WorkerMessage = {
            type: WorkerMessageType.AllowIdentify,
            shardId,
          };

          /** Send a message to the parent port to allow the shard to identify. */
          worker.postMessage(allowIdentifyMessage);
        },
      )
      .with(
        {
          type: ParentPortMessageType.ShardIdentified,
        },
        ({ shardId }) => logger.shard(`Shard ${shardId} was identified successfully.`),
      )
      .with(
        {
          type: ParentPortMessageType.ShardInformation,
        },
        (message) => {
          const { nonce } = message;
          const shardInformation = shardInformationRequestsCollection.get(nonce);

          if (shardInformation) {
            shardInformation(message);
            shardInformationRequestsCollection.delete(nonce);
          }
        },
      ),
  );

  return worker;
};
