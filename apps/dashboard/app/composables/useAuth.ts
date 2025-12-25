export function useAuth() {
	const login = () => navigateTo("/api/auth/login");
	const logout = () => navigateTo("/api/auth/logout");

	return {
		login,
		logout,
	};
}
