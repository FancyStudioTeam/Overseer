import { createCallbackUrl } from '#imports';

export default defineEventHandler((event) => sendRedirect(event, createCallbackUrl()));
