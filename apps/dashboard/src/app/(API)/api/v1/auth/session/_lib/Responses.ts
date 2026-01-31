/*
 * biome-ignore-all lint/style/useNamingConvention: These functions
 * intentionally use upper snake case because they represent HTTP responses.
 */

import 'server-only';

import { NextResponse } from 'next/server';
import {
	INTERNAL_SERVER_ERROR_STATUS_CODE,
	INTERNAL_SERVER_ERROR_STATUS_TEXT,
	UNAUTHORIZED_STATUS_CODE,
	UNAUTHORIZED_STATUS_TEXT,
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

export function UNAUTHORIZED_RESPONSE(): NextResponse {
	return NextResponse.json(
		{
			data: null,
			success: true,
		},
		{
			status: UNAUTHORIZED_STATUS_CODE,
			statusText: UNAUTHORIZED_STATUS_TEXT,
		},
	);
}
