import { CertificateIcon, FingerprintIcon, GridFourIcon, type Icon } from '@phosphor-icons/react';
import type { HTMLAttributeAnchorTarget } from 'react';
import { DropdownMenuGroup, DropdownMenuItem } from '#/components/ui/Dropdown.tsx';

const NAVBAR_CONTENT_LINKS: NavbarContentLink[] = [
	{
		href: '/dashboard',
		icon: GridFourIcon,
		name: 'Manage Guilds',
	},
	{
		href: '/legal/privacy-policy',
		icon: FingerprintIcon,
		name: 'Privacy Policy',
	},
	{
		href: '/legal/terms-of-service',
		icon: CertificateIcon,
		name: 'Terms of Service',
	},
];

export function NavbarProfileContentLinks() {
	return (
		<DropdownMenuGroup>
			{NAVBAR_CONTENT_LINKS.map(({ href, icon: Icon, name, target }) => (
				<DropdownMenuItem key={name}>
					<a
						className='flex items-center justify-between px-4 py-2 text-sm hover:bg-neutral-800'
						href={href}
						target={target}
					>
						{name}
						<Icon
							className='size-5 text-neutral-400'
							weight='fill'
						/>
					</a>
				</DropdownMenuItem>
			))}
		</DropdownMenuGroup>
	);
}

interface NavbarContentLink {
	href: string;
	icon: Icon;
	name: string;
	target?: HTMLAttributeAnchorTarget;
}
