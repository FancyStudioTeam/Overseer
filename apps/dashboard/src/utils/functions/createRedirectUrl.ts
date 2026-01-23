import { OAuth2Scopes } from 'discord-api-types/v10';
import { CLIENT_ID } from '#/lib/Constants.ts';
import { createCallbackUrl } from './createCallbackUrl.ts';

export function createRedirectUrl() {
	const scopes = [
		OAuth2Scopes.Email,
		OAuth2Scopes.Identify,
		OAuth2Scopes.Guilds,
	];

	const callbackUrl = createCallbackUrl();
	const scopesString = encodeURIComponent(scopes.join('+'));

	const redirectUrl =
		`https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${callbackUrl}&scope=${scopesString}` as const;

	return redirectUrl;
}
