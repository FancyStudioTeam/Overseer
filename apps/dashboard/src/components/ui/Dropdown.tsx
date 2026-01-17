import { DropdownMenu as RadixDropdownMenu } from 'radix-ui';
import type { ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';

export function DropdownMenu({ ...props }: DropdownMenuProps) {
	return <RadixDropdownMenu.Root {...props} />;
}

export function DropdownMenuContent({ className, ...props }: DropdownMenuContentProps) {
	return (
		<RadixDropdownMenu.Content
			{...props}
			className={twMerge(
				'z-50 data-[state=closed]:animate-duration-100 data-[state=closed]:animate-fade-out-up data-[state=open]:animate-duration-150 data-[state=open]:animate-fade-in-down',
				className,
			)}
		/>
	);
}

export function DropdownMenuGroup({ ...props }: DropdownMenuGroupProps) {
	return <RadixDropdownMenu.Group {...props} />;
}

export function DropdownMenuItem({ ...props }: DropdownMenuItemProps) {
	return <RadixDropdownMenu.Item {...props} />;
}

export function DropdownMenuLabel({ ...props }: DropdownMenuLabelProps) {
	return <RadixDropdownMenu.Label {...props} />;
}

export function DropdownMenuPortal({ ...props }: DropdownMenuPortalProps) {
	return <RadixDropdownMenu.Portal {...props} />;
}

export function DropdownMenuSeparator({ className, ...props }: DropdownMenuSeparatorProps) {
	return (
		<RadixDropdownMenu.Separator
			{...props}
			className={twMerge('h-px bg-neutral-700', className)}
		/>
	);
}

export function DropdownMenuTrigger({ ...props }: DropdownMenuTriggerProps) {
	return <RadixDropdownMenu.Trigger {...props} />;
}

export type DropdownMenuContentProps = ComponentProps<typeof RadixDropdownMenu.Content>;
export type DropdownMenuGroupProps = ComponentProps<typeof RadixDropdownMenu.Group>;
export type DropdownMenuItemProps = ComponentProps<typeof RadixDropdownMenu.Item>;
export type DropdownMenuLabelProps = ComponentProps<typeof RadixDropdownMenu.Label>;
export type DropdownMenuPortalProps = ComponentProps<typeof RadixDropdownMenu.Portal>;
export type DropdownMenuProps = ComponentProps<typeof RadixDropdownMenu.Root>;
export type DropdownMenuSeparatorProps = ComponentProps<typeof RadixDropdownMenu.Separator>;
export type DropdownMenuTriggerProps = ComponentProps<typeof RadixDropdownMenu.Trigger>;
