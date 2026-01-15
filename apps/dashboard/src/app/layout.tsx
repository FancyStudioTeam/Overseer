import type { Metadata } from 'next';
import './globals.css';

import { Figtree } from 'next/font/google';
import type { ReactNode } from 'react';

const FigtreeFont = Figtree({
	variable: '--font-figtree',
});

export const metadata: Metadata = {
	title: 'ByteZ',
};

export default function ({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	return (
		<html lang='en'>
			<body className={`${FigtreeFont.variable} bg-neutral-950 font-figtree font-regular text-neutral-50 antialiased`}>
				{children}
			</body>
		</html>
	);
}
