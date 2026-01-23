import { OAuth2Scopes, Routes } from 'discord-api-types/v10';
import { CLIENT_ID } from '#/lib/Constants.ts';
import { createCallbackUrl } from './createCallbackUrl.ts';

const { oauth2Authorization } = Routes;

const SCOPES = [
	OAuth2Scopes.Email,
	OAuth2Scopes.Identify,
	OAuth2Scopes.Guilds,
];

export function createRedirectUrl(state: string) {
	const redirectUrl = new URL(oauth2Authorization(), 'https://discord.com');
	const { searchParams } = redirectUrl;

	searchParams.append('client_id', CLIENT_ID);
	searchParams.append('response_type', 'code');
	searchParams.append('redirect_uri', encodeURIComponent(createCallbackUrl()));
	searchParams.append('scope', encodeURIComponent(SCOPES.join(' ')));
	searchParams.append('state', encodeURIComponent(btoa(state)));

	return redirectUrl.toString();
}
