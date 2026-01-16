import { VanguardCombinationMark } from '../shared/branding/VanguardCombinationMark.tsx';

export function Navbar() {
	return (
		<nav className='sticky top-0 flex h-12 items-center justify-between border-b bg-neutral-950/75 px-8 backdrop-blur-xl'>
			<VanguardCombinationMark />
		</nav>
	);
}
