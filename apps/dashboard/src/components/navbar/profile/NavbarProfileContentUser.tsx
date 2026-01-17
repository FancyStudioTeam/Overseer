import type { User } from 'better-auth';
import { DropdownMenuLabel } from '#/components/ui/Dropdown.tsx';

export function NavbarProfileContentUser({ user }: NavbarProfileContentUserProps) {
	const { name } = user;

	return <DropdownMenuLabel className='truncate px-4 py-2 font-stardom uppercase tracking-tighter'>{name}</DropdownMenuLabel>;
}

export interface NavbarProfileContentUserProps {
	user: User;
}
