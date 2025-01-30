import { createRestManager } from "@discordeno/bot";
import { DISCORD_TOKEN } from "@util/config.js";

export const RestManager = createRestManager({
  token: DISCORD_TOKEN,
});
