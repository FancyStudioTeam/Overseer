/*
 * biome-ignore-all lint/style/useNamingConvention: These functions
 * intentionally use upper snake case because they represent HTTP responses.
 */

import 'server-only';
import { NextResponse } from 'next/server';

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
