import type { User } from 'better-auth';
import { DropdownMenuContent, DropdownMenuPortal } from '#/components/ui/Dropdown.tsx';

export function NavbarProfileContent({ user }: NavbarProfileContentProps) {
	return (
		<DropdownMenuPortal>
			<DropdownMenuContent className='w-60 border bg-neutral-900 p-2'>
				<h1>W.I.P</h1>
			</DropdownMenuContent>
		</DropdownMenuPortal>
	);
}

export interface NavbarProfileContentProps {
	user: User;
}
