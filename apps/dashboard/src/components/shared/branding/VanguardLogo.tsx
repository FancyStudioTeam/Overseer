import type { HTMLProps } from 'react';
import { twMerge } from 'tailwind-merge';

export function VanguardLogo({ className, ...props }: VanguardLogoProps) {
	return (
		<h1
			{...props}
			className={twMerge('font-dm-serif-display text-xl', className)}
		>
			Vanguard
		</h1>
	);
}

export type VanguardLogoProps = HTMLProps<HTMLHeadingElement>;
