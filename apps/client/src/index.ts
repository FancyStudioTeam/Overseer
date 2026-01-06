import { loadEnvFile } from 'node:process';
import { Client, ClientEvents } from 'linkcord';
import { logger } from '#utils/Logger.js';

loadEnvFile();

export const client = new Client();

client.events.addEventListener(ClientEvents.Debug, (message) => logger.debug(message));
client.init().catch(console.error);
