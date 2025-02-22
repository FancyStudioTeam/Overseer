import { parentPort } from "node:worker_threads";
import { DiscordenoShard, type GatewayOpcodes, type ShardCreateOptions, TransportCompression } from "@discordeno/bot";
import { type MakeEventsRequestBody, makeEventsRequest } from "@functions/makeEventsRequest.js";
import { withResolvers } from "@functions/withResolvers.js";
import { OPCODES_NAMES } from "@util/constants.js";
import { logger } from "@util/logger.js";
import { ParentPortMessageType, type ParentPortRequestIdentify } from "@util/types.js";
import { identifyPromisesCollection, workerData } from "@workers/index.js";

/**
 * Creates a new shard instance.
 * @param id - The shard id.
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

  /** Forward the payload to the shard message event. */
  shard.forwardToBot = (payload) => shard.events.message?.(shard, payload);

  shard.events.message = async ({ id }, payload) => {
    const { op: rawOp } = payload;
    const op = rawOp as GatewayOpcodes;

    logger.shard(`Received a "${OPCODES_NAMES[op]}" payload from Shard ${id}.`);

    const { eventsProxy } = workerData;
    const { url } = eventsProxy;
    const eventsProxyUrl = `${url}/events`;
    const eventBody: MakeEventsRequestBody = {
      payload,
      // biome-ignore lint/style/useNamingConvention: Properties should be in snake case.
      shard_id: id,
    };

    await makeEventsRequest(eventsProxyUrl, eventBody);
  };

  shard.requestIdentify = async () => {
    logger.info(`Requesting worker to identify Shard ${id}...`);

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
