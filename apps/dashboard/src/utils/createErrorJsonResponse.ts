import 'server-only';
import { NextResponse } from 'next/server';

export function createErrorJsonResponse(
	status: number,
	statusText: string,
	error: ErrorResponseOptions,
): NextResponse {
	return NextResponse.json(
		{
			error,
			success: false,
		},
		{
			status,
			statusText,
		},
	);
}

interface ErrorResponseOptions {
	code: string;
	message: string;
}
