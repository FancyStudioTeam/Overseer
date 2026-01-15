import { headers } from 'next/headers';
import { LoginButton } from '#/components/Login.tsx';
import { auth } from '#/lib/Auth.ts';

export default async function Home() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		return <LoginButton />;
	}

	const { user } = session;
	const { name } = user;

	return (
		<main className='flex h-dvh w-full flex-col items-center justify-center gap-4'>
			<h1 className='text-center font-extrabold text-2xl'>
				Welcome back! <span className='font-black text-neutral-400'>{name}</span>
			</h1>
			<div className='w-80 flex-col gap-4 rounded-md border border-neutral-700 bg-neutral-900 p-6'>
				<a
					className='block w-full rounded-md bg-neutral-50 px-4 py-2 text-center text-neutral-950 text-sm'
					href='/dashboard'
				>
					Dashboard
				</a>
			</div>
		</main>
	);
}
