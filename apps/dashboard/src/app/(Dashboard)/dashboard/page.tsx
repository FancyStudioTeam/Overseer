import { headers } from 'next/headers';
import { unauthorized } from 'next/navigation';
import { Navbar } from '#/components/navbar/Navbar.tsx';
import { auth } from '#/lib/Auth.ts';

export default async function () {
	const sessionData = await auth.api.getSession({
		headers: await headers(),
	});

	if (!sessionData) {
		unauthorized();
	}

	return (
		<div className='flex h-full min-h-dvh justify-center'>
			<div className='w-full max-w-7xl xl:border-x'>
				<Navbar />
			</div>
		</div>
	);
}
