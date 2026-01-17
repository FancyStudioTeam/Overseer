import { authClient } from '#/lib/AuthClient.ts';

export function NavbarLoginButton() {
	const signInWithDiscord = async () => {
		await authClient.signIn.social({
			provider: 'discord',
		});
	};

	return (
		<button
			className='flex h-full w-full max-w-50 cursor-pointer select-none items-center justify-center gap-2 border-l px-8 font-stardom text-md tracking-tighter transition-colors hover:bg-neutral-900'
			onClick={signInWithDiscord}
			type='button'
		>
			Login with Discord
		</button>
	);
}
