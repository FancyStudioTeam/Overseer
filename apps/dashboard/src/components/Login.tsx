'use client';

import { authClient } from '#/lib/AuthClient.ts';

export function LoginButton() {
	const signInWithDiscord = () =>
		authClient.signIn.social({
			provider: 'discord',
			scopes: [
				'guilds',
				'identify',
			],
		});

	return (
		<button
			onClick={signInWithDiscord}
			type='button'
		>
			Login with Discord
		</button>
	);
}
