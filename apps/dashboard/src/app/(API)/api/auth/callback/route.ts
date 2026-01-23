import { type NextRequest, NextResponse } from 'next/server';
import { checkIsValidAuthState } from './_utils/checkIsValidAuthState.ts';

export async function GET(request: NextRequest) {
	const { nextUrl } = request;
	const { searchParams } = nextUrl;

	const code = searchParams.get('code');
	const state = searchParams.get('state');

	if (!code) {
		return NextResponse.json(
			{
				data: "Missing 'code' query string param from URL",
				success: false,
			},
			{
				status: 400,
				statusText: 'Bad Request',
			},
		);
	}

	if (!state) {
		return NextResponse.json(
			{
				data: "Missing 'state' query string param from URL",
				success: false,
			},
			{
				status: 400,
				statusText: 'Bad Request',
			},
		);
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
		return NextResponse.json(
			{
				data: 'OAuth2 state is not valid',
				success: false,
			},
			{
				status: 400,
				statusText: 'Bad Request',
			},
		);
	}
}
