import { randomBytes } from 'node:crypto';

const SESSION_ID_BYTES_LENGTH = 32;

export default defineEventHandler(async (event) => {
	const sessionId = randomBytes(SESSION_ID_BYTES_LENGTH).toString('base64url');
	const { update } = await sessionManager(event);

	await update({
		session_id: sessionId,
		username: 'Username',
	});

	sendRedirect(event, '/');
});
