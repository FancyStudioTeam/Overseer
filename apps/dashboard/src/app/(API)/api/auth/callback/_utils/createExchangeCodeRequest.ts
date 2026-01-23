import 'server-only';

import { type RESTPostOAuth2AccessTokenResult, Routes } from 'discord-api-types/v10';
import { CLIENT_ID, CLIENT_SECRET } from '#/lib/Constants.ts';
import { rest } from '#/lib/REST.ts';
import { createCallbackUrl } from '#/utils/functions/createCallbackUrl.ts';

const { oauth2TokenExchange } = Routes;

/**
 * @see https://discord.com/developers/docs/topics/oauth2#authorization-code-grant-access-token-exchange-example
 */
export async function createExchangeCodeRequest(
	code: string,
): Promise<RESTPostOAuth2AccessTokenResult> {
	const body = createExchangeCodeRequestBody(code).toString();
	const headers = createExchangeCodeRequestHeaders();

	const response = await rest.post(oauth2TokenExchange(), {
		body,
		headers,
	});

	return response as RESTPostOAuth2AccessTokenResult;
}

function createExchangeCodeRequestBody(code: string): URLSearchParams {
	return new URLSearchParams({
		client_id: CLIENT_ID,
		client_secret: CLIENT_SECRET,
		code,
		grant_type: 'authorization_code',
		redirect_uri: createCallbackUrl(),
		scope: 'email guilds guilds.members.read identify',
	});
}

function createExchangeCodeRequestHeaders(): Record<string, string> {
	return {
		'Content-Type': 'application/x-www-form-urlencoded',
	};
}
