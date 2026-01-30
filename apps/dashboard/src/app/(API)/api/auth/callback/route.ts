import { randomBytes } from 'node:crypto';
import { RateLimitError } from '@discordjs/rest';
import type { RESTGetAPIUserResult, RESTPostOAuth2AccessTokenResult } from 'discord-api-types/v10';
import { cookies as NextCookies } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';
import { sessionsCollection } from '#/lib/auth/MongoDB.ts';
import { Encryption } from '#/lib/Encryption.ts';
import { logger } from '#/lib/Logger.ts';
import {
	INVALID_AUTHORIZATION_STATE_RESPONSE,
	MISSING_QUERY_STRING_PARAM_RESPONSE,
	RATE_LIMITED_ERROR_RESPONSE,
	SOMETHING_WENT_WRONG_ERROR_RESPONSE,
	UNABLE_TO_EXCHANGE_CODE_RESPONSE,
	UNABLE_TO_GET_USER_INFORMATION_RESPONSE,
} from './_lib/Responses.ts';
import { checkIsValidAuthState } from './_utils/checkIsValidAuthState.ts';
import { createExchangeCodeRequest } from './_utils/createExchangeCodeRequest.ts';
import { createJsonWebToken } from './_utils/createJsonWebToken.ts';
import { getUserInformation } from './_utils/getUserInformation.ts';

const SESSION_ID_BYTES_LENGTH = 32;

export async function GET(request: NextRequest) {
	try {
		const { nextUrl } = request;
		const { origin, searchParams } = nextUrl;

		const code = searchParams.get('code');
		const state = searchParams.get('state');

		if (!code) {
			return MISSING_QUERY_STRING_PARAM_RESPONSE('code');
		}

		if (!state) {
			return MISSING_QUERY_STRING_PARAM_RESPONSE('state');
		}

		/*
		 * Check whether the provided state by Discord is the same as the stored
		 * OAuth2 state.
		 *
		 * If the state is not the same, the user may have been clickjacked.
		 *
		 * Reference: https://discord.com/developers/docs/topics/oauth2#state-and-security
		 */
		const nextCookies = await NextCookies();
		const isValidAuthState = checkIsValidAuthState(state, nextCookies);

		if (!isValidAuthState) {
			return INVALID_AUTHORIZATION_STATE_RESPONSE();
		}

		let exchangeCodeResult: RESTPostOAuth2AccessTokenResult;
		let userInformationResult: RESTGetAPIUserResult;

		try {
			exchangeCodeResult = await createExchangeCodeRequest(code);
		} catch (error) {
			switch (true) {
				case error instanceof RateLimitError: {
					return RATE_LIMITED_ERROR_RESPONSE();
				}

				default: {
					logger.error('Error while exchanging the authorization code:\n\t', error);

					return UNABLE_TO_EXCHANGE_CODE_RESPONSE();
				}
			}
		}

		const { access_token, expires_in, refresh_token } = exchangeCodeResult;

		try {
			userInformationResult = await getUserInformation(access_token);
		} catch (error) {
			switch (true) {
				case error instanceof RateLimitError: {
					return RATE_LIMITED_ERROR_RESPONSE();
				}

				default: {
					logger.error('Error while fetching the user information:\n\t', error);

					return UNABLE_TO_GET_USER_INFORMATION_RESPONSE();
				}
			}
		}

		const { avatar, global_name, id, username } = userInformationResult;
		const name = global_name ?? username;

		/*
		 * Keep personal and private information from users encrypted.
		 */
		const encryptedAccessToken = Encryption.encrypt(access_token);
		const encryptedRefreshToken = Encryption.encrypt(refresh_token);

		const sessionIdBytes = randomBytes(SESSION_ID_BYTES_LENGTH);
		const sessionIdString = sessionIdBytes.toString('hex');

		await sessionsCollection.insertOne({
			credentials: {
				access_token: encryptedAccessToken,
				refesh_token: encryptedRefreshToken,
			},
			session_id: sessionIdString,
			user: {
				avatar,
				id,
				name,
			},
		});

		await createJsonWebToken(sessionIdString, id, nextCookies, expires_in);

		return NextResponse.redirect(origin);
	} catch (error) {
		logger.error(`Error while processing '/api/auth/callback':\n\t`, error);

		return SOMETHING_WENT_WRONG_ERROR_RESPONSE();
	}
}
