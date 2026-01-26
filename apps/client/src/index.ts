import { loadEnvFile } from 'node:process';
import { Client, ClientEvents } from 'linkcord';
import { logger } from '#lib/Logger.js';
import { getEnvFileName } from '#utils/getEnvFileName.js';
import { getErrorMessage } from '#utils/getErrorMessage.js';

/*
 * Load the correct '.env' file depending on `NODE_ENV`.
 */
loadEnvFile(getEnvFileName());

export const client = new Client();

client.events.addEventListener(ClientEvents.Debug, (message) => logger.debug(message));

/**
 * Initialize the client to load its dependencies. (Commands and Events)
 */
client
	.init()
	.then(() => logger.info('Client has been initialized'))
	.catch((error) => logger.error(getErrorMessage(error)));
