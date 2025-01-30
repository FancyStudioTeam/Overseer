import { GatewayManager } from "@managers/GatewayManager.js";
import { Controller } from "@nestjs/common";

@Controller("gateway")
export class GatewayController {}

await GatewayManager.spawnShards();
