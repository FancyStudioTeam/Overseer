export default defineEventHandler(async (event) => {
	try {
		const { clear } = await sessionManager(event);

		await clear();
	} catch (error) {
		console.error(error);
	} finally {
		sendRedirect(event, '/');
	}
});
