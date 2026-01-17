import { SignOutIcon } from '@phosphor-icons/react';
import { authClient } from '#/lib/AuthClient.ts';

export function NavbarProfileContentLogout() {
	const logOut = async () => {
		await authClient.signOut();
	};

	return (
		<button
			className='flex w-full cursor-pointer items-center justify-between px-4 py-2 text-red-400 text-sm transition-colors hover:bg-neutral-900'
			onClick={logOut}
			type='button'
		>
			Log Out
			<SignOutIcon className='size-5' />
		</button>
	);
}
