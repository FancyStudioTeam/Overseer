import { Logo } from '../Logo.tsx';

export function Navbar() {
	return (
		<nav className='sticky top-0 flex h-12 w-full items-center border-neutral-700 border-b border-dashed px-12 backdrop-blur-xl'>
			<a
				className='flex items-center gap-2 font-extrabold text-xl'
				href='/'
			>
				<Logo className='size-7' />
				ByteZ
			</a>
		</nav>
	);
}
