import type { User } from 'better-auth';
import { DropdownMenuContent, DropdownMenuPortal, DropdownMenuSeparator } from '#/components/ui/Dropdown.tsx';
import { NavbarProfileContentLinks } from './NavbarProfileContentLinks.tsx';
import { NavbarProfileContentLogout } from './NavbarProfileContentLogout.tsx';
import { NavbarProfileContentUser } from './NavbarProfileContentUser.tsx';

export function NavbarProfileContent({ user }: NavbarProfileContentProps) {
	return (
		<DropdownMenuPortal>
			<DropdownMenuContent className='w-55 border bg-neutral-950'>
				<NavbarProfileContentUser user={user} />
				<DropdownMenuSeparator />
				<NavbarProfileContentLinks />
				<DropdownMenuSeparator />
				<NavbarProfileContentLogout />
			</DropdownMenuContent>
		</DropdownMenuPortal>
	);
}

export interface NavbarProfileContentProps {
	user: User;
}
