import { VanguardLogo } from './VanguardLogo.tsx';
import { VanguardSymbol } from './VanguardSymbol.tsx';

export function VanguardCombinationMark() {
	return (
		<a
			aria-label='Vanguard Home'
			className='flex select-none items-center gap-1'
			href='/'
		>
			<VanguardSymbol />
			<VanguardLogo />
		</a>
	);
}
