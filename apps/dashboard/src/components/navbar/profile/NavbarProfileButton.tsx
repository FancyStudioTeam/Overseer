import { UserIcon } from '@phosphor-icons/react';
import type { User } from 'better-auth';
import { DropdownMenuTrigger } from '#/components/ui/Dropdown.tsx';

export function NavbarProfileButton({ user }: NavbarProfileButtonProps) {
	const { name } = user;

	return (
		<DropdownMenuTrigger className='flex size-full cursor-pointer items-center justify-center gap-2 px-8 font-stardom tracking-tighter transition-colors hover:bg-neutral-900'>
			<UserIcon
				className='size-5 shrink-0'
				weight='duotone'
			/>
			<span className='truncate'>{name}</span>
		</DropdownMenuTrigger>
	);
}

export interface NavbarProfileButtonProps {
	user: User;
}
