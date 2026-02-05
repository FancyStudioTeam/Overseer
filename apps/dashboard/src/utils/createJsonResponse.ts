import 'server-only';
import { NextResponse } from 'next/server';

export function createJsonResponse(
	statusCode: number,
	statusText: string,
	data: DataOptions,
): NextResponse {
	return NextResponse.json(
		{
			data,
			success: true,
		},
		{
			status: statusCode,
			statusText,
		},
	);
}

type DataOptions = Record<string, unknown>;
