import { OAuth2Routes, OAuth2Scopes } from 'discord-api-types/v10';
import { CLIENT_ID } from '#/lib/Constants.ts';
import { createCallbackUrl } from './createCallbackUrl.ts';

const { authorizationURL } = OAuth2Routes;

const SCOPES = [
	OAuth2Scopes.Email,
	OAuth2Scopes.Identify,
	OAuth2Scopes.Guilds,
];

export function createRedirectUrl(state: string): string {
	const callbackUrl = createCallbackUrl();
	const scopesString = SCOPES.join(' ');

	const encodedScopes = encodeURIComponent(scopesString);
	const encodedState = encodeURIComponent(btoa(state));
	const encodedRedirectUri = encodeURIComponent(callbackUrl);

	const authorizationUrl = new URL(authorizationURL);
	const { searchParams } = authorizationUrl;

	searchParams.append('client_id', CLIENT_ID);
	searchParams.append('response_type', 'code');
	searchParams.append('prompt', 'consent');
	searchParams.append('redirect_uri', encodedRedirectUri);
	searchParams.append('scope', encodedScopes);
	searchParams.append('state', encodedState);

	return authorizationUrl.toString();
}
