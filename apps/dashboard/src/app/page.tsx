import { headers } from 'next/headers';
import { auth } from '#/lib/Auth.ts';

export default async function Home() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (session) {
		return <h1>Welcome {session.user.name}</h1>;
	}

	return <h1>Log In</h1>;
}
