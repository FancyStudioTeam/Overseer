import type { Metadata } from 'next';
import './globals.css';

import { Figtree } from 'next/font/google';
import type { ReactNode } from 'react';

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
				className={`${FigtreeFont.variable} bg-neutral-950 font-figtree font-regular text-neutral-50 antialiased selection:bg-neutral-50 selection:text-neutral-950`}
			>
				{children}
			</body>
		</html>
	);
}
