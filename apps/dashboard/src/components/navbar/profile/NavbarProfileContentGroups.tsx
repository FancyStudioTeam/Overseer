import {
	CertificateIcon,
	DiscordLogoIcon,
	FingerprintIcon,
	GridFourIcon,
} from '@phosphor-icons/react';
import { GithubLogoIcon } from '@phosphor-icons/react/dist/ssr';
import { Fragment } from 'react/jsx-runtime';
import { DropdownMenuSeparator } from '#/components/ui/Dropdown.tsx';
import { DISCORD_SUPPORT_INVITE_URL, GITHUB_REPOSITORY_URL } from '#/utils/SafeConstants.ts';
import {
	NavbarProfileContentGroup,
	type NavbarProfileContentGroupProps,
} from './NavbarProfileContentGroup.tsx';

const NAVBAR_CONTENT_GROUPS_ITEMS: NavbarProfileContentGroupProps[] = [
	{
		links: [
			{
				href: '/dashboard',
				icon: GridFourIcon,
				name: 'Manage Guilds',
			},
		],
		name: 'Management',
	},
	{
		links: [
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
		],
		name: 'Legal',
	},
	{
		links: [
			{
				href: DISCORD_SUPPORT_INVITE_URL,
				icon: DiscordLogoIcon,
				name: 'Discord Server',
				target: '_blank',
			},
			{
				href: GITHUB_REPOSITORY_URL,
				icon: GithubLogoIcon,
				name: 'Source Code',
				target: '_blank',
			},
		],
		name: 'Useful Links',
	},
];

export function NavbarProfileContentGroups() {
	return NAVBAR_CONTENT_GROUPS_ITEMS.map(({ links, name }, index) => (
		<Fragment key={name}>
			<NavbarProfileContentGroup
				links={links}
				name={name}
			/>
			{isLastElementIndex(index) && <DropdownMenuSeparator />}
		</Fragment>
	));
}

function isLastElementIndex(index: number): boolean {
	return index < NAVBAR_CONTENT_GROUPS_ITEMS.length - 1;
}
