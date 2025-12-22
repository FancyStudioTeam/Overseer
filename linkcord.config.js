// @ts-check

import { env } from "node:process";
import { defineConfig, GatewayIntents } from "linkcord";

const DISCORD_TOKEN = env.DISCORD_TOKEN;

export default defineConfig({
	intents: [
		GatewayIntents.Guilds,
		GatewayIntents.GuildMessages,
		GatewayIntents.MessageContent,
	],
	token: String(DISCORD_TOKEN),
});
