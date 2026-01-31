import { cookies as NextCookies } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';
import { sessionsCollection } from '#/lib/auth/MongoDB.ts';
import { OK_STATUS_CODE, OK_STATUS_TEXT } from '#/lib/HTTPStatus.ts';
import { Jose } from '#/lib/Jose.ts';
import { logger } from '#/lib/Logger.ts';
import { INTERNAL_SERVER_ERROR_RESPONSE } from '../sign-in/_lib/Responses.ts';
import { UNAUTHORIZED_RESPONSE } from './_lib/Responses.ts';

export async function GET(nextRequest: NextRequest) {
	try {
		const nextCookies = await NextCookies();
		const sessionCookie = nextCookies.get('session');

		if (!sessionCookie) {
			return UNAUTHORIZED_RESPONSE();
		}

		const { value } = sessionCookie;
		const sessionId = await Jose.verify(value);

		if (!sessionId) {
			return UNAUTHORIZED_RESPONSE();
		}

		const session = await sessionsCollection.findOne({
			session_id: sessionId,
		});

		if (!session) {
			nextCookies.delete('session');

			return UNAUTHORIZED_RESPONSE();
		}

		const { user } = session;
		const { avatar, id, name } = user;

		return NextResponse.json(
			{
				data: {
					avatar,
					id,
					name,
				},
				success: true,
			},
			{
				status: OK_STATUS_CODE,
				statusText: OK_STATUS_TEXT,
			},
		);
	} catch (error) {
		const { nextUrl } = nextRequest;
		const { href } = nextUrl;

		logger.error(`Error while processing '${href}':\n\t`, error);

		return INTERNAL_SERVER_ERROR_RESPONSE();
	}
}
