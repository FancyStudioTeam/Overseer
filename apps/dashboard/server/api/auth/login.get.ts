import { createCallbackUrl } from "#imports";

export default defineEventHandler((event) => {
	return sendRedirect(event, createCallbackUrl());
});
