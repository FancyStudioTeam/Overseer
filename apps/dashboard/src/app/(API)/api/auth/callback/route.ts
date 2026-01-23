import { RateLimitError } from '@discordjs/rest';
import type { RESTGetAPIUserResult, RESTPostOAuth2AccessTokenResult } from 'discord-api-types/v10';
import { type NextRequest, NextResponse } from 'next/server';
import { collection } from '#/lib/auth/MongoDB.ts';
import { Encryption } from '#/lib/Encryption.ts';
import { logger } from '#/lib/Logger.ts';
import {
	INVALID_AUTHORIZATION_STATE_RESPONSE,
	MISSING_CODE_QUERY_STRING_PARAM_RESPONSE,
	MISSING_STATE_QUERY_STRING_PARAM_RESPONSE,
	RATE_LIMITED_ERROR_RESPONSE,
	SOMETHING_WENT_WRONG_ERROR_RESPONSE,
	UNABLE_TO_EXCHANGE_CODE_RESPONSE,
	UNABLE_TO_GET_USER_INFORMATION_RESPONSE,
} from './_lib/Responses.ts';
import { checkIsValidAuthState } from './_utils/checkIsValidAuthState.ts';
import { createExchangeCodeRequest } from './_utils/createExchangeCodeRequest.ts';
import { getUserInformation } from './_utils/getUserInformation.ts';

export async function GET(request: NextRequest) {
	try {
		const { nextUrl } = request;
		const { searchParams } = nextUrl;

		const code = searchParams.get('code');
		const state = searchParams.get('state');

		if (!code) {
			return MISSING_CODE_QUERY_STRING_PARAM_RESPONSE();
		}

		if (!state) {
			return MISSING_STATE_QUERY_STRING_PARAM_RESPONSE();
		}

		/*
		 * Check whether the provided state by Discord is the same as the stored
		 * OAuth2 state.
		 *
		 * If the state is not the same, the user may have been clickjacked.
		 *
		 * Reference: https://discord.com/developers/docs/topics/oauth2#state-and-security
		 */
		const isValidAuthState = await checkIsValidAuthState(state);

		if (!isValidAuthState) {
			return INVALID_AUTHORIZATION_STATE_RESPONSE();
		}

		let exchangeCodeResult: RESTPostOAuth2AccessTokenResult;
		let userInformationResult: RESTGetAPIUserResult;

		try {
			exchangeCodeResult = await createExchangeCodeRequest(code);
		} catch (error) {
			logger.error(error);

			switch (true) {
				case error instanceof RateLimitError: {
					return RATE_LIMITED_ERROR_RESPONSE();
				}

				default: {
					return UNABLE_TO_EXCHANGE_CODE_RESPONSE();
				}
			}
		}

		const { access_token, refresh_token } = exchangeCodeResult;

		try {
			userInformationResult = await getUserInformation(access_token);
		} catch (error) {
			logger.error(error);

			switch (true) {
				case error instanceof RateLimitError: {
					return RATE_LIMITED_ERROR_RESPONSE();
				}

				default: {
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

		await collection.insertOne({
			credentials: {
				access_token: encryptedAccessToken,
				refesh_token: encryptedRefreshToken,
			},
			user: {
				avatar,
				id,
				name,
			},
		});

		return NextResponse.redirect('/');
	} catch (error) {
		logger.error(error);

		return SOMETHING_WENT_WRONG_ERROR_RESPONSE();
	}
}
