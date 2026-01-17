import type { User } from 'better-auth';
import Image from 'next/image';
import { DropdownMenuTrigger } from '#/components/ui/Dropdown.tsx';

export function NavbarProfileButton({ user }: NavbarProfileButtonProps) {
	const { image, name } = user;
	const userAvatar = image ?? 'https://cdn.discordapp.com/embed/avatars/1.png';

	return (
		<DropdownMenuTrigger className='flex h-full w-full max-w-50 cursor-pointer select-none items-center justify-center gap-2 border-l px-8 font-stardom text-md tracking-tighter transition-colors hover:bg-neutral-900'>
			<Image
				alt={`${name}'s Avatar`}
				className='aspect-square size-5 rounded-xs'
				height={0}
				src={userAvatar}
				unoptimized={true}
				width={0}
			/>
			<span className='truncate uppercase'>{name}</span>
		</DropdownMenuTrigger>
	);
}

export interface NavbarProfileButtonProps {
	user: User;
}
