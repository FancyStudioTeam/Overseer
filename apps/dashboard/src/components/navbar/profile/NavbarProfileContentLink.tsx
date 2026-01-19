import { ArrowSquareOutIcon, type Icon } from '@phosphor-icons/react';
import Link from 'next/link';
import type { HTMLAttributeAnchorTarget } from 'react';
import { DropdownMenuItem } from '#/components/ui/Dropdown.tsx';

export function NavbarProfileContentLink({
	href,
	icon: PhosphorIcon,
	name,
	target,
}: NavbarProfileContentLinkProps) {
	return (
		<DropdownMenuItem>
			<Link
				className='flex items-center gap-2 px-4 py-2 text-sm transition-colors hover:bg-neutral-900'
				href={href}
				prefetch={false}
				target={target}
			>
				<PhosphorIcon
					className='size-5 shrink-0'
					weight='duotone'
				/>
				<span className='truncate'>{name}</span>
				{isExternalLink(target) && (
					<ArrowSquareOutIcon className='ml-auto size-5 shrink-0 text-neutral-400' />
				)}
			</Link>
		</DropdownMenuItem>
	);
}

function isExternalLink(target?: HTMLAttributeAnchorTarget): boolean {
	return target === '_blank';
}

export interface NavbarProfileContentLinkProps {
	href: string;
	icon: Icon;
	name: string;
	target?: HTMLAttributeAnchorTarget;
}
