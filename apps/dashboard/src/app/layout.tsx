import type { Metadata } from 'next';
import './globals.css';

import { DM_Serif_Display, Figtree } from 'next/font/google';
import type { ReactNode } from 'react';

const DmSerifDisplayFont = DM_Serif_Display({
	variable: '--font-dm-serif-display',
	weight: '400',
});

const FigtreeFont = Figtree({
	variable: '--font-figtree',
});

export const metadata: Metadata = {
	title: 'Vanguard - Simplicity without compromise',
};

export default function ({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	return (
		<html lang='en'>
			<body
				className={`${DmSerifDisplayFont.variable} ${FigtreeFont.variable} bg-neutral-950 font-figtree font-regular text-neutral-50 antialiased selection:bg-neutral-50 selection:text-neutral-950`}
			>
				{children}
			</body>
		</html>
	);
}
