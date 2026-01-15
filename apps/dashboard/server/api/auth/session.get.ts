const INTERNAL_SERVER_ERROR_STATUS = 500;
const UNAUTHORIZED_STATUS = 401;

export default defineEventHandler(async (event) => {
	try {
		const { data, isAuthorized } = await sessionManager(event);

		if (!isAuthorized) {
			setResponseStatus(event, UNAUTHORIZED_STATUS, 'Unauthorized');

			return {
				is_authorized: false,
				success: false,
			};
		}

		/*
		 * Clone the "data" object to avoid mutating the original object.
		 */
		const clonedData = structuredClone(data);

		/*
		 * Do not expose credentials to the client.
		 */
		Reflect.deleteProperty(clonedData, 'session_id');
		Reflect.deleteProperty(clonedData, 'access_token');
		Reflect.deleteProperty(clonedData, 'refresh_token');

		return {
			data: clonedData,
			is_authorized: true,
			success: true,
		};
	} catch {
		setResponseStatus(event, INTERNAL_SERVER_ERROR_STATUS, 'Internal Server Error');

		return {
			success: false,
		};
	}
});
