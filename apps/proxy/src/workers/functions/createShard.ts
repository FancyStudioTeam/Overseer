import { parentPort } from "node:worker_threads";
import { DiscordenoShard, type GatewayOpcodes, type ShardCreateOptions, TransportCompression } from "@discordeno/bot";
import { withResolvers } from "@functions/withResolvers.js";
import { EVENTS_AUTHORIZATION } from "@util/config.js";
import { OPCODES_NAMES } from "@util/constants.js";
import { logger } from "@util/logger.js";
import { ParentPortMessageType, type ParentPortRequestIdentify } from "@util/types.js";
import { identifyPromisesCollection, workerData } from "@workers/index.js";

/**
 * Creates a new shard instance.
 * @param id The shard ID.
 * @returns The created shard instance.
 */
export const createShard = (id: number): DiscordenoShard => {
  const { gatewayConnection } = workerData;
  const { intents, token, totalShards, url, version } = gatewayConnection;
  const shardOptions: ShardCreateOptions = {
    connection: {
      compress: false,
      intents,
      properties: {
        browser: "Discord Android",
        device: "Discordeno",
        os: process.platform,
      },
      token,
      totalShards,
      transportCompression: TransportCompression.zlib,
      url,
      version,
    },
    events: {},
    id,
  };
  const shard = new DiscordenoShard(shardOptions);

  shard.forwardToBot = (payload) => shard.events.message?.(shard, payload);

  shard.events.message = async ({ id }, payload) => {
    const { op: rawOp } = payload;
    const op = rawOp as GatewayOpcodes;

    logger.info(`Received "${OPCODES_NAMES[op]}" payload from shard ${id}.`);

    const { eventsProxy } = workerData;
    const { url } = eventsProxy;
    const eventsProxyUrl = `${url}/events`;
    const eventBody = JSON.stringify({
      payload,
      shardId: id,
    });

    await fetch(eventsProxyUrl, {
      body: eventBody,
      headers: {
        authorization: EVENTS_AUTHORIZATION,
        "content-type": "application/json",
      },
      method: "POST",
    })
      .then(() => logger.info(`Sent "${OPCODES_NAMES[op]}" payload to events proxy.`))
      .catch((fetchError) => {
        const error = fetchError instanceof Error ? fetchError : new Error(fetchError);

        logger.error(error.stack);
      });
  };

  shard.requestIdentify = async () => {
    logger.info(`Requesting worker to identify shard ${id}...`);

    const { promise, resolve } = withResolvers<void>();
    const requestIdentifyMessage: ParentPortRequestIdentify = {
      shardId: id,
      type: ParentPortMessageType.RequestIdentify,
    };

    /** Send a message to the worker to request the shard to identify. */
    parentPort?.postMessage(requestIdentifyMessage);
    identifyPromisesCollection.set(id, resolve);

    return await promise;
  };

  return shard;
};
