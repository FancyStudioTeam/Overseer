import { env } from "@utils";

export const NODE_ENV = env("NODE_ENV").trim().toLowerCase();

export const DISCORD_TOKEN = env("DISCORD_TOKEN");

export const EVENTS_ALLOWED_IPS = env("EVENTS_ALLOWED_IPS").split(",");
export const EVENTS_AUTHORIZATION = env("EVENTS_AUTHORIZATION");
export const EVENTS_HOST = env("EVENTS_HOST");
export const EVENTS_PORT = env("EVENTS_PORT");

export const PROXY_AUTHORIZATION = env("PROXY_AUTHORIZATION");
export const PROXY_URL = env("PROXY_URL");
