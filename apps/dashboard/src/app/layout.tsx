import './globals.css';

import { Geist, Inter } from 'next/font/google';
import type { ReactNode } from 'react';

const GeistFont = Geist({
	subsets: [
		'latin',
	],
	variable: '--font-geist',
});

const InterFont = Inter({
	subsets: [
		'latin',
	],
	variable: '--font-inter',
});

export default function RootLayout({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	return (
		<html lang='en'>
			<body className={`${InterFont.variable} ${GeistFont.variable} bg-neutral-950 font-geist text-neutral-50 antialiased`}>
				{children}
			</body>
		</html>
	);
}
