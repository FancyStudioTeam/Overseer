import { env } from 'node:process';

const { NODE_ENV = 'production' } = env;

export function getEnvFileName() {
	const productionStringRegex = /production/i;
	const isProductionEnvironment = productionStringRegex.test(NODE_ENV);

	return isProductionEnvironment
		? ('.env.production' as const)
		: ('.env.development' as const);
}
