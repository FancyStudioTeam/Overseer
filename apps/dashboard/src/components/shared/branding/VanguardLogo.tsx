import type { HTMLProps } from 'react';
import { twMerge } from 'tailwind-merge';

export function VanguardLogo({ className, ...props }: VanguardLogoProps) {
	return (
		<h1
			{...props}
			className={twMerge('font-stardom text-xl tracking-tighter', className)}
		>
			Vanguard
		</h1>
	);
}

export type VanguardLogoProps = HTMLProps<HTMLHeadingElement>;
