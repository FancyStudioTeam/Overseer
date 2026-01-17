import type { HTMLProps } from 'react';
import { twMerge } from 'tailwind-merge';
import { VanguardLogo } from './VanguardLogo.tsx';
import { VanguardSymbol } from './VanguardSymbol.tsx';

export function VanguardCombinationMark({ className, ...props }: VanguardCombinationMarksProps) {
	return (
		<a
			aria-label='Vanguard Home'
			className={twMerge('flex select-none items-center gap-0.5 transition-opacity hover:opacity-75', className)}
			href='/'
			{...props}
		>
			<VanguardSymbol />
			<VanguardLogo />
		</a>
	);
}

export type VanguardCombinationMarksProps = HTMLProps<HTMLAnchorElement>;
