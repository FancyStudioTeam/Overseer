import type { ReactNode } from 'react';
import { Navbar } from '#/components/navbar/Navbar.tsx';

export function PageLayout({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	return (
		<div className='flex h-full min-h-dvh justify-center'>
			<div className='w-full max-w-7xl xl:border-x'>
				<Navbar />
				{children}
			</div>
		</div>
	);
}
