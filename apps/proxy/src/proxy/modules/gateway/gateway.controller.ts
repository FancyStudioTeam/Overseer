import { GatewayManager } from "@managers/GatewayManager.js";
import { Controller } from "@nestjs/common";

@Controller("gateway")
/** TODO: Add shard payloads handler. */
export class GatewayController {}

await GatewayManager.spawnShards();
