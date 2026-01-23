import type { NextRequest } from 'next/server';
import {
	INVALID_AUTHORIZATION_STATE_RESPONSE,
	MISSING_CODE_QUERY_STRING_PARAM_RESPONSE,
	MISSING_STATE_QUERY_STRING_PARAM_RESPONSE,
} from './_lib/Responses.ts';
import { checkIsValidAuthState } from './_utils/checkIsValidAuthState.ts';

export async function GET(request: NextRequest) {
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
}
