import { randomBytes } from 'node:crypto';
import { sessions } from '~~/server/utils/MongoDB';

const SESSION_ID_BYTES_LENGTH = 32;

export default defineEventHandler(async (event) => {
	try {
		const sessionId = randomBytes(SESSION_ID_BYTES_LENGTH).toString('base64url');
		const { update } = await sessionManager(event);

		await sessions.insertOne({
			access_token: '123',
			refresh_token: '123',
			user_id: sessionId,
		});

		await update({
			session_id: sessionId,
			username: 'Username',
		});
	} catch (error) {
		console.error(error);
	} finally {
		sendRedirect(event, '/');
	}
});
