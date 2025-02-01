import { type GatewayOpcodes, createGatewayManager } from "@discordeno/bot";
import {
  DISCORD_TOKEN,
  EVENTS_AUTHORIZATION,
  EVENTS_URL,
  GATEWAY_INTENTS,
  SHARDS_PER_WORKER,
  TOTAL_SHARDS,
  TOTAL_WORKERS,
} from "@util/config.js";
import { OPCODES_NAMES, SENDABLE_OPCODES } from "@util/constants.js";
import { logger } from "@util/logger.js";
import { RestManager } from "./RestManager.js";

const gatewayConnection = RestManager.getGatewayBot();

export const GatewayManager = createGatewayManager({
  connection: await gatewayConnection,
  events: {
    message: (shard, payload) => shard.forwardToBot(payload),
  },
  intents: GATEWAY_INTENTS,
  resharding: {
    checkInterval: 28_800_000,
    enabled: true,
    getSessionInfo: () => gatewayConnection,
    shardsFullPercentage: 80,
  },
  shardsPerWorker: Number.parseInt(SHARDS_PER_WORKER),
  token: DISCORD_TOKEN,
  totalShards: Number.parseInt(TOTAL_SHARDS),
  totalWorkers: Number.parseInt(TOTAL_WORKERS),
});

GatewayManager.events.message = async ({ id }, payload) => {
  const { op: rawOp } = payload;
  const op = rawOp as GatewayOpcodes;

  logger.info(`Received "${OPCODES_NAMES[op]}" payload from shard ${id}.`);

  if (!SENDABLE_OPCODES.includes(op)) {
    return;
  }

  await fetch(`${EVENTS_URL}/events`, {
    body: JSON.stringify({
      payload,
      shardId: id,
    }),
    headers: {
      authorization: EVENTS_AUTHORIZATION,
      "content-type": "application/json",
    },
    method: "POST",
  })
    .then(() => logger.info(`Sent "${OPCODES_NAMES[op]}" payload to events handler.`))
    .catch((fetchError) => {
      const error = fetchError instanceof Error ? fetchError.stack : new Error(fetchError);

      logger.error(error);
    });
};
