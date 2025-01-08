import { parentPort } from "node:worker_threads";
import { EVENTS_AUTHORIZATION } from "@config";
import { DiscordenoShard, GatewayOpcodes, TransportCompression } from "@discordeno/bot";
import { logger } from "@util/logger.js";
import { promiseWithResolvers } from "@util/utils/promiseWithResolvers.js";
import { ManagerMessageTypes, type ManagerRequestIdentifyMessage } from "@workers/types.js";
import { identifyPromisesCollection, workerData } from "../index.js";

const OPCODES_NAMES: Record<GatewayOpcodes, string> = {
  [GatewayOpcodes.Dispatch]: "Dispatch",
  [GatewayOpcodes.HeartbeatACK]: "Heartbeat Acknowledged",
  [GatewayOpcodes.Heartbeat]: "Heartbeat",
  [GatewayOpcodes.Hello]: "Hello",
  [GatewayOpcodes.Identify]: "Identify",
  [GatewayOpcodes.InvalidSession]: "Invalid Session",
  [GatewayOpcodes.PresenceUpdate]: "Presence Update",
  [GatewayOpcodes.Reconnect]: "Reconnect",
  [GatewayOpcodes.RequestGuildMembers]: "Request Guild Members",
  [GatewayOpcodes.RequestSoundboardSounds]: "Request Soundboard Sounds",
  [GatewayOpcodes.Resume]: "Resume",
  [GatewayOpcodes.VoiceStateUpdate]: "Voice State Update",
};
const SENDABLE_OPCODES = [
  GatewayOpcodes.Dispatch,
  GatewayOpcodes.Heartbeat,
  GatewayOpcodes.Identify,
  GatewayOpcodes.PresenceUpdate,
  GatewayOpcodes.RequestGuildMembers,
  GatewayOpcodes.RequestSoundboardSounds,
  GatewayOpcodes.Resume,
  GatewayOpcodes.VoiceStateUpdate,
];

export const createShard = (shardId: number) => {
  const shard = new DiscordenoShard({
    connection: {
      compress: false,
      intents: workerData.connection.intents,
      properties: {
        browser: "Discord Android",
        device: "Discordeno",
        os: process.platform,
      },
      token: workerData.connection.token,
      totalShards: workerData.connection.totalShards,
      transportCompression: TransportCompression.zlib,
      url: workerData.connection.url,
      version: workerData.connection.version,
    },
    events: {},
    id: shardId,
  });

  shard.requestIdentify = async () => {
    logger.info(`Requesting manager to identify shard ${shardId}...`);

    const { promise, resolve } = promiseWithResolvers<void>();

    parentPort?.postMessage({
      shardId,
      type: ManagerMessageTypes.RequestIdentify,
    } satisfies ManagerRequestIdentifyMessage);

    identifyPromisesCollection.set(shardId, resolve);

    return await promise;
  };

  shard.forwardToBot = (payload) => shard.events.message?.(shard, payload);

  shard.events.message = async (shard, payload) => {
    const op = payload.op as GatewayOpcodes;

    logger.info(`Received "${OPCODES_NAMES[op]}" payload from shard ${shard.id}.`);

    if (!SENDABLE_OPCODES.includes(op)) {
      return;
    }

    const urls = workerData.events.urls;
    const url = urls[shard.id % urls.length];

    if (!url) {
      logger.warn("Events handler url not found, ignoring payload...");

      return;
    }

    await fetch(url, {
      body: JSON.stringify({
        payload,
        shardId,
      }),
      headers: {
        authorization: EVENTS_AUTHORIZATION,
        "content-type": "application/json",
      },
      method: "POST",
    })
      .then(() => logger.info(`Sent "${OPCODES_NAMES[op]}" payload to events handler.`))
      .catch((fetchError) => {
        const error = fetchError instanceof Error ? fetchError : new Error(fetchError);

        logger.error(error);
      });
  };

  return shard;
};
