import { loadEnvFile } from 'node:process';
import { Client, ClientEvents } from 'linkcord';
import { logger } from '#lib/Logger.js';
import { getEnvFileName } from '#utils/getEnvFileName.js';

/*
 * Load the correct `.env` file based on `NODE_ENV`.
 *
 * - Use `.env.development` if NODE_ENV is `development`.
 * - Use `.env.production` if NODE_ENV is `production`.
 */
loadEnvFile(getEnvFileName());

export const client = new Client();

client.events.addEventListener(ClientEvents.Debug, (message) =>
	logger.debug(message),
);

/*
 * - Connect the shards of the client to the Discord gateway.
 * - Load and register the application commands and event listeners.
 */
client
	.init()
	.then(() => logger.info('Client has been successfully initialized'))
	.catch((error) =>
		logger.error('Error while initializing the client:\n\t', error),
	);
