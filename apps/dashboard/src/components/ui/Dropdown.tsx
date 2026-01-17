import { DropdownMenu as RadixDropdownMenu } from 'radix-ui';
import type { ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';

export function DropdownMenu({ ...props }: DropdownMenuProps) {
	return <RadixDropdownMenu.Root {...props} />;
}

export function DropdownMenuContent({ className, ...props }: DropdownMenuContentProps) {
	return (
		<RadixDropdownMenu.Content
			className={twMerge(
				'data-[state=closed]:animate-duration-150 data-[state=closed]:animate-fade-out-up data-[state=open]:animate-duration-150 data-[state=open]:animate-fade-in-down',
				className,
			)}
			{...props}
		/>
	);
}

export function DropdownMenuPortal({ ...props }: DropdownMenuPortalProps) {
	return <RadixDropdownMenu.Portal {...props} />;
}

export function DropdownMenuTrigger({ ...props }: DropdownMenuTriggerProps) {
	return <RadixDropdownMenu.Trigger {...props} />;
}

export type DropdownMenuContentProps = ComponentProps<typeof RadixDropdownMenu.Content>;
export type DropdownMenuPortalProps = ComponentProps<typeof RadixDropdownMenu.Portal>;
export type DropdownMenuProps = ComponentProps<typeof RadixDropdownMenu.Root>;
export type DropdownMenuTriggerProps = ComponentProps<typeof RadixDropdownMenu.Trigger>;
