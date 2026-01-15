import { headers } from 'next/headers';
import { LoginButton } from '#/components/Login.tsx';
import { auth } from '#/lib/Auth.ts';

export default async function Home() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (session) {
		return <LoginButton />;
	}

	return <h1>Log In</h1>;
}
