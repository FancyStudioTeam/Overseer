'use client';

import { FingerprintIcon } from '@phosphor-icons/react';
import { useSession } from '#/hooks/useSession.ts';

export function NavbarLoginButton() {
	const { signIn } = useSession();

	const handleSignIn = () => signIn();

	return (
		<button
			className='flex size-full cursor-pointer items-center justify-center gap-2 px-8 font-stardom tracking-tighter transition-colors hover:bg-neutral-900'
			onClick={handleSignIn}
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
