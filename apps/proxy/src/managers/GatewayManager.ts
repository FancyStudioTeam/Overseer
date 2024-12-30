import { DISCORD_TOKEN, GATEWAY_INTENTS, SHARDS_PER_WORKER, TOTAL_SHARDS, TOTAL_WORKERS } from "@config";
import { createGatewayManager } from "@discordeno/bot";
import { RestManager } from "./RestManager.js";

const gatewayConnection = await RestManager.getGatewayBot();

export const GatewayManager = createGatewayManager({
  connection: gatewayConnection,
  intents: GATEWAY_INTENTS,
  shardsPerWorker: Number.parseInt(SHARDS_PER_WORKER),
  token: DISCORD_TOKEN,
  totalShards: Number.parseInt(TOTAL_SHARDS),
  totalWorkers: Number.parseInt(TOTAL_WORKERS),
});
