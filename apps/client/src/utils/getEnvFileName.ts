import { env } from 'node:process';

const { NODE_ENV = 'production' } = env;

/**
 * Gets the correct `.env` file based on `NODE_ENV`.
 *
 * @returns The name of the `.env` file.
 *
 * @remarks
 * The returned value is either `.env.production` or `.env.development`.
 */
export function getEnvFileName() {
	const productionStringRegex = /production/i;
	const isProductionEnvironment = productionStringRegex.test(NODE_ENV);

	return isProductionEnvironment ? ('.env.production' as const) : ('.env.development' as const);
}
