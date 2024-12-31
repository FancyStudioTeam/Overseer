import { join } from "node:path";
import { Worker } from "node:worker_threads";
import { DISCORD_TOKEN, EVENTS_AUTHORIZATION, EVENTS_URL, GATEWAY_INTENTS } from "@config";
import { GatewayManager } from "@managers/GatewayManager.js";
import { logger } from "@util/Logger.js";
import { getDirnameFromFileUrl } from "@utils";
import { match } from "ts-pattern";
import {
  type ManagerMessage,
  ManagerMessageTypes,
  type WorkerAllowIdentifyMessage,
  type WorkerDataOptions,
  WorkerMessageTypes,
} from "../types.js";

const {
  connection: { url },
  totalShards,
  version,
} = GatewayManager;

export const createWorker = (workerId: number) => {
  const currentFolder = getDirnameFromFileUrl(import.meta.url);
  const workerPath = join(currentFolder, "worker.js");
  const worker = new Worker(workerPath, {
    workerData: {
      connection: {
        intents: GATEWAY_INTENTS,
        token: DISCORD_TOKEN,
        totalShards,
        url,
        version,
      },
      events: {
        authorization: EVENTS_AUTHORIZATION,
        urls: [EVENTS_URL],
      },
      workerId,
    } satisfies WorkerDataOptions,
  });

  worker.on("message", (message: ManagerMessage) => {
    match(message)
      .with(
        {
          type: ManagerMessageTypes.RequestIdentify,
        },
        async ({ shardId }) => {
          logger.info(`Received request to identify shard ${shardId}, allowing identify...`);

          await GatewayManager.requestIdentify(shardId);

          /**
           * Tell the worker to allow the shard to identify.
           */
          worker.postMessage({
            shardId,
            type: WorkerMessageTypes.AllowIdentify,
          } satisfies WorkerAllowIdentifyMessage);
        },
      )
      .otherwise((message) => logger.error(`Received unknown manager message: ${message}`));
  });

  return worker;
};
