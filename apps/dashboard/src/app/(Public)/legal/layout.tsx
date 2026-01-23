import type { ReactNode } from 'react';
import { PageLayout } from '#/layouts/PageLayout.tsx';

export default function ({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	return <PageLayout>{children}</PageLayout>;
}
