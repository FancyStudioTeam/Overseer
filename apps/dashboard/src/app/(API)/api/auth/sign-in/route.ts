import { NextResponse } from 'next/server';
import { logger } from '#/lib/Logger.ts';
import { createRedirectUrl } from '#/utils/functions/createRedirectUrl.ts';

export function POST() {
	try {
		return NextResponse.redirect(createRedirectUrl());
	} catch (error) {
		logger.error(error);

		return NextResponse.json({
			success: false,
		});
	}
}
