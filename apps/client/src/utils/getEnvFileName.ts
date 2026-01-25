import { IS_PRODUCTION_ENVIRONMENT } from 'linkcord/utils';

/**
 * Gets the correct `.env` file depending on the `IS_PRODUCTION_ENVIRONMENT`
 * constant from Linkcord.
 *
 * @remarks
 * Linkcord will return either `production` or `development` from `NODE_ENV`.
 *
 * If `NODE_ENV` is not set, `production` will be returned as default.
 */
export function getEnvFileName() {
	if (IS_PRODUCTION_ENVIRONMENT) {
		return '.env.production' as const;
	}

	return '.env.development' as const;
}
