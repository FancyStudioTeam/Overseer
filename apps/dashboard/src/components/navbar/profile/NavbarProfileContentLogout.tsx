'use client';

import { SignOutIcon } from '@phosphor-icons/react';
import { authClient } from '#/lib/AuthClient.ts';

export function NavbarProfileContentLogout() {
	const signOutFromDiscord = async () => await authClient.signOut();

	return (
		<button
			className='flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-red-400 text-sm transition-colors hover:bg-neutral-900'
			onClick={signOutFromDiscord}
			type='button'
		>
			<SignOutIcon className='size-5 shrink-0' />
			<span className='truncate'>Log Out</span>
		</button>
	);
}
