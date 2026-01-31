/*
 * biome-ignore-all lint/style/useNamingConvention: These functions
 * intentionally use upper snake case because they represent HTTP responses.
 */

import 'server-only';

import type { NextResponse } from 'next/server';
import {
	BAD_REQUEST_STATUS_CODE,
	BAD_REQUEST_STATUS_TEXT,
	INTERNAL_SERVER_ERROR_STATUS_CODE,
	INTERNAL_SERVER_ERROR_STATUS_TEXT,
	TOO_MANY_REQUESTS_STATUS_CODE,
	TOO_MANY_REQUESTS_STATUS_TEXT,
} from '#/lib/HTTPStatus.ts';
import { createErrorJsonResponse } from '#/utils/createErrorJsonResponse.ts';

export function INTERNAL_SERVER_ERROR_RESPONSE(): NextResponse {
	return createErrorJsonResponse(
		INTERNAL_SERVER_ERROR_STATUS_CODE,
		INTERNAL_SERVER_ERROR_STATUS_TEXT,
		{
			code: 'INTERNAL_SERVER_ERROR',
			message: 'Something went wrong while processing your request',
		},
	);
}

export function INVALID_AUTHORIZATION_STATE_RESPONSE(): NextResponse {
	return createErrorJsonResponse(
		BAD_REQUEST_STATUS_CODE,
		BAD_REQUEST_STATUS_TEXT,
		{
			code: 'INVALID_AUTHORIZATION_STATE',
			message: 'Invalid Discord authorization state',
		},
	);
}

export function MISSING_QUERY_STRING_PARAM_RESPONSE(
	name: string,
): NextResponse {
	return createErrorJsonResponse(
		BAD_REQUEST_STATUS_CODE,
		BAD_REQUEST_STATUS_TEXT,
		{
			code: 'MISSING_QUERY_STRING_PARAM',
			details: {
				name,
			},
			message: 'Missing query string parameter from URL',
		},
	);
}

export function RATE_LIMITED_ERROR_RESPONSE(): NextResponse {
	return createErrorJsonResponse(
		TOO_MANY_REQUESTS_STATUS_CODE,
		TOO_MANY_REQUESTS_STATUS_TEXT,
		{
			code: 'RATE_LIMITED_BY_DISCORD',
			message: 'You are being rate limited by Discord',
		},
	);
}

export function UNABLE_TO_EXCHANGE_CODE_RESPONSE(): NextResponse {
	return createErrorJsonResponse(
		INTERNAL_SERVER_ERROR_STATUS_CODE,
		INTERNAL_SERVER_ERROR_STATUS_TEXT,
		{
			code: 'UNABLE_TO_EXCHANGE_CODE',
			message: 'Unable to exchange your authorization code with Discord',
		},
	);
}

export function UNABLE_TO_GET_USER_INFORMATION_RESPONSE(): NextResponse {
	return createErrorJsonResponse(
		INTERNAL_SERVER_ERROR_STATUS_CODE,
		INTERNAL_SERVER_ERROR_STATUS_TEXT,
		{
			code: 'UNABLE_TO_GET_USER_INFORMATION',
			message: 'Unable to get your user information from Discord',
		},
	);
}
