import { authClient } from '#/lib/AuthClient.ts';

export function NavbarLoginButton() {
	const signInWithDiscord = async () => {
		await authClient.signIn.social({
			provider: 'discord',
		});
	};

	return (
		<button
			className='grid size-full cursor-pointer place-content-center px-8 font-stardom tracking-tighter transition-colors hover:bg-neutral-900'
			onClick={signInWithDiscord}
			type='button'
		>
			<span className='truncate'>Login with Discord</span>
		</button>
	);
}
