export function useAuth() {
	const session = useFetch('/api/auth/session', {
		pick: [
			'data',
		],
	});

	const login = () => navigateTo('/api/auth/login');
	const logout = () => navigateTo('/api/auth/logout');

	return {
		login,
		logout,
		session,
	};
}
