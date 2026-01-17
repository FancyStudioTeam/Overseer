'use client';

import { authClient } from '#/lib/AuthClient.ts';
import { NavbarLoginButton } from './NavbarLoginButton.tsx';
import { NavbarProfile } from './profile/NavbarProfile.tsx';

export function NavbarCtaButton() {
	const { data: session } = authClient.useSession();
	const { user } = session ?? {};

	if (!(session && user)) {
		return <NavbarLoginButton />;
	}

	return <NavbarProfile user={user} />;
}
