import { OAuth2Scopes } from 'discord-api-types/v10';
import { CLIENT_ID } from '#imports';

const SCOPES = [
	OAuth2Scopes.Identify,
	OAuth2Scopes.Guilds,
] as const;

export function createCallbackUrl() {
	const callbackUrl = encodeURIComponent(createRedirectUrl());
	const scopes = encodeURIComponent(SCOPES.join(' '));

	return `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${callbackUrl}&scope=${scopes}` as const;
}
