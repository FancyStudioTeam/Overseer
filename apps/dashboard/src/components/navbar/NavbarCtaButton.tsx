'use client';

import { useSession } from '#/hooks/useSession.ts';
import { NavbarLoginButton } from './NavbarLoginButton.tsx';

export function NavbarCtaButton() {
	const { session } = useSession();
	const { error, isLoading } = session;

	if (isLoading) {
		return <NavbarLoginButton />;
	}

	if (error) {
		console.error('ERROR: ', error);
	}
}
