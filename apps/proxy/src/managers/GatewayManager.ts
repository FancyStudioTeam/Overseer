import { createGatewayManager } from "@discordeno/bot";
import { DISCORD_TOKEN, GATEWAY_INTENTS, SHARDS_PER_WORKER, TOTAL_SHARDS, TOTAL_WORKERS } from "@util/config.js";
import { RestManager } from "./RestManager.js";
import { overrideGatewayManager } from "./functions/overrideGatewayManager.js";

const gatewayConnection = RestManager.getGatewayBot();

export const GatewayManager = createGatewayManager({
  connection: await gatewayConnection,
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

overrideGatewayManager(GatewayManager);
