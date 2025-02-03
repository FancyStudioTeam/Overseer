import { type CreateRestManagerOptions, createRestManager } from "@discordeno/bot";
import { DISCORD_TOKEN } from "@util/config.js";

const restManagerOptions: CreateRestManagerOptions = {
  token: DISCORD_TOKEN,
};

export const RestManager = createRestManager(restManagerOptions);
