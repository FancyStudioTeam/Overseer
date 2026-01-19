import Link from 'next/link';
import type { ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';
import { VanguardLogo } from './VanguardLogo.tsx';
import { VanguardSymbol } from './VanguardSymbol.tsx';

export function VanguardCombinationMark({ className, ...props }: VanguardCombinationMarksProps) {
	return (
		<Link
			{...props}
			aria-label='Vanguard Home'
			className={twMerge(
				'flex select-none items-center gap-0.5 transition-opacity hover:opacity-75',
				className,
			)}
			prefetch={false}
		>
			<VanguardSymbol />
			<VanguardLogo />
		</Link>
	);
}

export type VanguardCombinationMarksProps = ComponentProps<typeof Link>;
