import { IS_PRODUCTION_ENVIRONMENT } from 'linkcord/utils';

export function getEnvFileName() {
	return IS_PRODUCTION_ENVIRONMENT ? '.env.production' : ('.env.development' as const);
}
