import { VanguardCombinationMark } from '../shared/branding/VanguardCombinationMark.tsx';
import { NavbarCtaButton } from './NavbarCtaButton.tsx';

export function Navbar() {
	return (
		<nav className='sticky top-0 z-10 flex h-10 items-center divide-x border-b bg-neutral-950/75 backdrop-blur-xl'>
			<div className='flex size-full items-center gap-4'>
				<VanguardCombinationMark
					className='mx-8'
					href='/'
				/>
			</div>
			<div className='flex size-full max-w-50'>
				<NavbarCtaButton />
			</div>
		</nav>
	);
}
