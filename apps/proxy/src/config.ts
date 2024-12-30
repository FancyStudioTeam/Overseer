import { GatewayIntents } from "@discordeno/bot";
import { env } from "@utils";

export const DISCORD_TOKEN = env("DISCORD_TOKEN");

export const PROXY_AUTHORIZATION = env("PROXY_AUTHORIZATION");
export const PROXY_HOST = env("PROXY_HOST");
export const PROXY_PORT = env("PROXY_PORT");

export const EVENTS_AUTHORIZATION = env("EVENTS_AUTHORIZATION");
export const EVENTS_URL = env("EVENTS_URL");

export const GATEWAY_INTENTS = GatewayIntents.GuildMessages | GatewayIntents.Guilds | GatewayIntents.MessageContent;
export const SHARDS_PER_WORKER = env("SHARDS_PER_WORKER");
export const TOTAL_SHARDS = env("TOTAL_SHARDS");
export const TOTAL_WORKERS = env("TOTAL_WORKERS");
