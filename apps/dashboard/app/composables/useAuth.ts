export function useAuth() {
	const login = () => navigateTo("/api/auth/login");

	return {
		login,
	};
}
