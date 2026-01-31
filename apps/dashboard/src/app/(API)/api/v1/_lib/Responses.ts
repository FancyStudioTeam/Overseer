/*
 * biome-ignore-all lint/style/useNamingConvention: These functions
 * intentionally use upper snake case because they represent HTTP responses.
 */

import 'server-only';

import type { NextResponse } from 'next/server';
import {
	INTERNAL_SERVER_ERROR_STATUS_CODE,
	INTERNAL_SERVER_ERROR_STATUS_TEXT,
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
