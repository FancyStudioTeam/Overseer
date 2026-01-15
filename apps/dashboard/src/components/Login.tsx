'use client';

import { authClient } from '#/lib/AuthClient.ts';

export function LoginButton() {
	const signInWithDiscord = () =>
		authClient.signIn.social({
			provider: 'discord',
		});

	return (
		<button
			className='cursor-pointer rounded-md bg-neutral-50 px-4 py-2 text-neutral-950 text-sm'
			onClick={signInWithDiscord}
			type='button'
		>
			Login with Discord
		</button>
	);
}
