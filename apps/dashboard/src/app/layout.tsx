import './globals.css';

import { Plus_Jakarta_Sans } from 'next/font/google';
import type { ReactNode } from 'react';

const PlusJakartaSans = Plus_Jakarta_Sans({
	subsets: [
		'latin',
	],
	variable: '--font-plus-jakarta-sans',
});

export default function RootLayout({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	return (
		<html lang='en'>
			<body className={`${PlusJakartaSans.variable} bg-neutral-950 font-plus-jakarta-sans text-neutral-50 antialiased`}>
				{children}
			</body>
		</html>
	);
}
