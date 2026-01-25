import { IS_PRODUCTION_ENVIRONMENT } from 'linkcord/utils';

/**
 * Gets the correct `.env` file depending on the `IS_PRODUCTION_ENVIRONMENT`
 * constant from Linkcord.
 */
export function getEnvFileName() {
	if (IS_PRODUCTION_ENVIRONMENT) {
		return '.env.production' as const;
	}

	return '.env.development' as const;
}
