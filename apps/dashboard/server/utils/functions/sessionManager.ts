/*
 * biome-ignore lint/correctness/noUndeclaredDependencies: "h3" is globally
 * available in Nuxt projects.
 */
import type { H3Event, SessionManager as H3SessionManager } from "h3";

const ONE_WEEK_SECONDS = 604_800;

export async function sessionManager<Event extends H3Event>(event: Event): Promise<SessionManager> {
	const { data, ...sessionManagerMethods } = await useSession<H3SessionInfo>(event, {
		cookie: {
			httpOnly: true,
			maxAge: ONE_WEEK_SECONDS,
			path: "/",
			sameSite: "strict",
			secure: true,
		},
		name: "h3_session",
		password: SESSION_KEY,
	});

	const hasSessionId = Reflect.has(data, "session_id");
	const hasUsername = Reflect.has(data, "username");

	const isAuthorized = hasSessionId && hasUsername;

	return {
		...sessionManagerMethods,
		data,
		isAuthorized,
	};
}

interface SessionManager extends H3SessionManager<H3SessionInfo> {
	isAuthorized: boolean;
}
