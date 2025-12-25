export function useAuth() {
	const session = useFetch("/api/auth/session", {
		pick: [
			"data",
			"is_authorized",
		],
	});

	const login = () => navigateTo("/api/auth/login");
	const logout = () => navigateTo("/api/auth/logout");

	return {
		login,
		logout,
		session,
	};
}
