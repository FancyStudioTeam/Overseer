import { loadEnvFile } from 'node:process';
import { Client, ClientEvents } from 'linkcord';
import { IS_PRODUCTION_ENVIRONMENT } from 'linkcord/utils';
import { logger } from '#utils/Logger.js';

loadEnvFile(IS_PRODUCTION_ENVIRONMENT ? '.env.prod' : '.env.dev');

export const client = new Client();

client.events.addEventListener(ClientEvents.Debug, logger.debug);
client.init().catch(logger.error);
