import { DropdownMenuGroup, DropdownMenuLabel } from '#/components/ui/Dropdown.tsx';
import {
	NavbarProfileContentLink,
	type NavbarProfileContentLinkProps,
} from './NavbarProfileContentLink.tsx';

export function NavbarProfileContentGroup({ links, name }: NavbarProfileContentGroupProps) {
	return (
		<DropdownMenuGroup>
			<DropdownMenuLabel className='px-4 py-2 font-bold text-neutral-400 text-xs uppercase'>
				{name}
			</DropdownMenuLabel>
			{links.map(({ name, ...rest }) => (
				<NavbarProfileContentLink
					key={name}
					name={name}
					{...rest}
				/>
			))}
		</DropdownMenuGroup>
	);
}

export interface NavbarProfileContentGroupProps {
	links: NavbarProfileContentLinkProps[];
	name: string;
}
