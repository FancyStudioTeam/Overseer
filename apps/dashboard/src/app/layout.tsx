import './globals.css';

import { Geist } from 'next/font/google';
import type { ReactNode } from 'react';

const GeneralSans = Geist({
	subsets: [
		'latin',
	],
	variable: '--font-geist-sans',
});

export default function RootLayout({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	return (
		<html lang='en'>
			<body className={`${GeneralSans.variable} bg-neutral-950 font-sans text-neutral-50 antialiased`}>{children}</body>
		</html>
	);
}
