import type { User } from 'better-auth';
import {
	DropdownMenuContent,
	DropdownMenuPortal,
	DropdownMenuSeparator,
} from '#/components/ui/Dropdown.tsx';
import { NavbarProfileContentGroups } from './NavbarProfileContentGroups.tsx';
import { NavbarProfileContentLogout } from './NavbarProfileContentLogout.tsx';

export function NavbarProfileContent() {
	return (
		<DropdownMenuPortal>
			<DropdownMenuContent className='w-50 border bg-neutral-950'>
				<NavbarProfileContentGroups />
				<DropdownMenuSeparator />
				<NavbarProfileContentLogout />
			</DropdownMenuContent>
		</DropdownMenuPortal>
	);
}

export interface NavbarProfileContentProps {
	user: User;
}
