import type { User } from 'better-auth';
import { DropdownMenu } from '#/components/ui/Dropdown.tsx';
import { NavbarProfileButton } from './NavbarProfileButton.tsx';
import { NavbarProfileContent } from './NavbarProfileContent.tsx';

export function NavbarProfile({ user }: NavbarProfileProps) {
	return (
		<DropdownMenu modal={false}>
			<NavbarProfileButton user={user} />
			<NavbarProfileContent />
		</DropdownMenu>
	);
}

export interface NavbarProfileProps {
	user: User;
}
