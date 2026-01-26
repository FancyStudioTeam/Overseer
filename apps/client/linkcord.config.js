// @ts-check

import { env } from 'node:process';
import { defineConfig } from 'linkcord';
import { GatewayIntents } from 'linkcord/types';

const { DISCORD_TOKEN } = env;

if (!DISCORD_TOKEN) {
	throw new TypeError(`Environment variable 'DISCORD_TOKEN' is not configured`);
}

export default defineConfig({
	intents: [
		GatewayIntents.Guilds,
		GatewayIntents.GuildMembers,
		GatewayIntents.GuildMessages,
		GatewayIntents.GuildPresences,
		GatewayIntents.MessageContent,
	],
	token: `Bot ${DISCORD_TOKEN}`,
});
