import 'reflect-metadata';

import { loadEnvFile } from 'node:process';
import { Client, ClientEvents } from 'linkcord';
import { logger } from '#lib/Logger.js';
import { getEnvFileName } from '#utils/getEnvFileName.js';

loadEnvFile(getEnvFileName());

export const client = new Client();

client.events.addEventListener(ClientEvents.Debug, logger.debug);
client.init().catch(logger.error);
