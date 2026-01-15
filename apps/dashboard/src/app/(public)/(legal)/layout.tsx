import type { ReactNode } from 'react';
import { Navbar } from '#/components/navbar/Navbar.tsx';

export default function ({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	return (
		<div className='flex h-full min-h-dvh w-full justify-center'>
			<div className='w-full max-w-7xl border-neutral-700 border-x border-dashed'>
				<Navbar />
				<main className='flex flex-col gap-4 p-12 text-md'>{children}</main>
			</div>
		</div>
	);
}
