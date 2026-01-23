import type { ReactNode } from 'react';
import { PageLayout } from '#/app/layouts/PageLayout.tsx';

export default function ({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	return <PageLayout>{children}</PageLayout>;
}
