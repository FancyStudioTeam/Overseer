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

export function RATE_LIMITED_ERROR_RESPONSE(): NextResponse {
	return NextResponse.json(
		{
			data: 'You are being rate limited',
			success: false,
		},
		{
			status: 429,
			statusText: 'Too Many Requests',
		},
	);
}

export function SOMETHING_WENT_WRONG_ERROR_RESPONSE(): NextResponse {
	return NextResponse.json(
		{
			data: 'Something went wrong while processing your request...',
			success: false,
		},
		{
			status: 500,
			statusText: 'Internal Server Error',
		},
	);
}

export function UNABLE_TO_EXCHANGE_CODE_RESPONSE(): NextResponse {
	return NextResponse.json(
		{
			data: 'Unable to exchange the authorization code',
			success: false,
		},
		{
			status: 500,
			statusText: 'Internal Server Error',
		},
	);
}

export function UNABLE_TO_GET_USER_INFORMATION_RESPONSE(): NextResponse {
	return NextResponse.json(
		{
			data: 'Unable to get the user information',
			success: false,
		},
		{
			status: 500,
			statusText: 'Internal Server Error',
		},
	);
}
