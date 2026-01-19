import { Navbar } from '#/components/navbar/Navbar.tsx';

export default function () {
	return (
		<div className='flex h-full min-h-dvh justify-center'>
			<div className='w-full max-w-7xl xl:border-x'>
				<Navbar />
			</div>
		</div>
	);
}
