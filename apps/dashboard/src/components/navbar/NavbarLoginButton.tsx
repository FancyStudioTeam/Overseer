import { FingerprintIcon } from '@phosphor-icons/react';
import { authClient } from '#/lib/AuthClient.ts';

export function NavbarLoginButton() {
	const signInWithDiscord = async () => {
		await authClient.signIn.social({
			provider: 'discord',
		});
	};

	return (
		<button
			className='flex size-full cursor-pointer items-center justify-center gap-2 px-8 font-stardom tracking-tighter transition-all hover:bg-neutral-900 hover:opacity-75'
			onClick={signInWithDiscord}
			type='button'
		>
			<FingerprintIcon
				className='size-5 shrink-0'
				weight='duotone'
			/>
			<span className='truncate'>Login with Discord</span>
		</button>
	);
}
