import 'server-only';

import { OAuth2Routes, OAuth2Scopes } from 'discord-api-types/v10';
import { CLIENT_ID } from '#/lib/Constants.ts';
import { createCallbackUrl } from './createCallbackUrl.ts';

const { authorizationURL } = OAuth2Routes;

const SCOPES = [
	OAuth2Scopes.Email,
	OAuth2Scopes.Identify,
	OAuth2Scopes.Guilds,
	OAuth2Scopes.GuildsMembersRead,
];

/**
 * Creates a redirect URL to the application authorization page with the
 * specified options.
 */
export function createRedirectUrl(state: string): string {
	const callbackUrl = createCallbackUrl();

	/**
	 * NOTE: Join Discord scopes with '+'.
	 */
	const scopesString = SCOPES.join('+');

	const authorizationUrl = new URL(authorizationURL);
	const { searchParams } = authorizationUrl;

	/*
	 * When using 'URLSearchParams' methods, their value will be encoded.
	 *
	 * This assignment MUST be made before setting other query string parameters,
	 * as this property overrides all search properties.
	 */
	authorizationUrl.search = `scope=${scopesString}`;

	searchParams.set('client_id', CLIENT_ID);
	searchParams.set('redirect_uri', callbackUrl);
	searchParams.set('response_type', 'code');

	/*
	 * Set 'prompt' to 'none' to avoid the user from clicking 'Authorize' when they
	 * already previously authorized the application with the specified scopes.
	 */
	searchParams.set('prompt', 'none');
	searchParams.set('state', state);

	return authorizationUrl.toString();
}
