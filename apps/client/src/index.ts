import { loadEnvFile } from 'node:process';
import { Client, ClientEvents } from 'linkcord';
import { logger } from '#lib/Logger.js';
import { getEnvFileName } from '#utils/getEnvFileName.js';
import { getErrorMessage } from '#utils/getErrorMessage.js';

/*
 * Load the correct .env file based on NODE_ENV.
 *
 * - If NODE_ENV is development, .env.development will be used.
 * - If NODE_ENV is production, .env.production will be used.
 */
loadEnvFile(getEnvFileName());

export const client = new Client();

client.events.addEventListener(ClientEvents.Debug, (message) => logger.debug(message));

/*
 * - Connect the client to the Discord gateway.
 * - Load and register the application command and event listeners.
 */
client
	.init()
	.then(() => logger.info('Client has been initialized'))
	.catch((error) => logger.error(getErrorMessage(error)));
