/*
 * biome-ignore-all lint/style/useNamingConvention: These functions
 * intentionally use upper snake case because they represent HTTP responses.
 */

import 'server-only';

import { NextResponse } from 'next/server';
import { UNAUTHORIZED_STATUS_CODE, UNAUTHORIZED_STATUS_TEXT } from '#/lib/HTTPStatus.ts';

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
