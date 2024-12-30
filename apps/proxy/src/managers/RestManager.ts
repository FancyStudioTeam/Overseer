import { DISCORD_TOKEN } from "@config";
import { createRestManager } from "@discordeno/bot";

export const RestManager = createRestManager({
  token: DISCORD_TOKEN,
});
