import { authClient } from '#/lib/AuthClient.ts';

export function NavbarLoginButton() {
	const signInWithDiscord = async () => {
		await authClient.signIn.social({
			provider: 'discord',
		});
	};

	return (
		<button
			className='flex size-full cursor-pointer items-center justify-center font-stardom tracking-tighter transition-colors hover:bg-neutral-900'
			onClick={signInWithDiscord}
			type='button'
		>
			Login with Discord
		</button>
	);
}
