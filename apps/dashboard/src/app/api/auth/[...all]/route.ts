import { toNextJsHandler } from 'better-auth/next-js';
import { auth } from '#/lib/Auth.ts';

export const { GET, POST } = toNextJsHandler(auth);
