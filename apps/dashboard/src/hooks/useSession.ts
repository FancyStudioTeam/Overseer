import 'client-only';

import { useRouter } from 'next/navigation';
import useSwr from 'swr';

const fetcher = (url: string) => fetch(url).then((response) => response.json());

export function useSession() {
	const { data, error, isLoading, isValidating } = useSwr(
		'/api/v1/auth/session',
		fetcher,
	);
	const { replace } = useRouter();

	return {
		session: {
			data,
			error,
			isLoading,
			isValidating,
		},
		signIn: () => replace('/api/auth/sign-in'),
	};
}
