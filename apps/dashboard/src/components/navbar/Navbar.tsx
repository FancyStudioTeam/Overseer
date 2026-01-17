import { VanguardCombinationMark } from '../shared/branding/VanguardCombinationMark.tsx';
import { NavbarCtaButton } from './NavbarCtaButton.tsx';

export function Navbar() {
	return (
		<nav className='sticky top-0 z-10 flex h-12 items-center justify-between border-b bg-neutral-950/75 pl-8 backdrop-blur-xl'>
			<VanguardCombinationMark />
			<NavbarCtaButton />
		</nav>
	);
}
