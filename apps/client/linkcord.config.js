// @ts-check

import { env } from 'node:process';
import { defineConfig } from 'linkcord';
import { GatewayIntents } from 'linkcord/types';

const { DISCORD_TOKEN = 'xxxxxxxxxx.xxxxxxxxxx.xxxxxxxxxx' } = env;

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
