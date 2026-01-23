/*
 * biome-ignore-all lint/style/useNamingConvention: These functions
 * intentionally use upper snake case because they represent HTTP responses.
 */

import 'server-only';

import { NextResponse } from 'next/server';

export function INVALID_AUTHORIZATION_STATE_RESPONSE(): NextResponse {
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

export function MISSING_CODE_QUERY_STRING_PARAM_RESPONSE(): NextResponse {
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

export function MISSING_STATE_QUERY_STRING_PARAM_RESPONSE(): NextResponse {
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
