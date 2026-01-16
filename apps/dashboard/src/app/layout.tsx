import './globals.css';

import type { Metadata } from 'next';
import LocalFont from 'next/font/local';
import type { ReactNode } from 'react';

const GeneralSansFont = LocalFont({
	src: '../../public/fonts/GeneralSans.woff2',
	variable: '--font-general-sans',
});

const StardomFont = LocalFont({
	src: '../../public/fonts/Stardom.woff2',
	variable: '--font-stardom',
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
				className={`${GeneralSansFont.variable} ${StardomFont.variable} bg-neutral-950 font-general-sans font-normal text-neutral-50 antialiased selection:bg-neutral-50 selection:text-neutral-950`}
			>
				{children}
			</body>
		</html>
	);
}
