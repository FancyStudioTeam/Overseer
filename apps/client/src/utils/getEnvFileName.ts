import { IS_PRODUCTION_ENVIRONMENT } from 'linkcord/utils';

export function getEnvFileName() {
	if (IS_PRODUCTION_ENVIRONMENT) {
		return '.env.production' as const;
	}

	return '.env.development' as const;
}
