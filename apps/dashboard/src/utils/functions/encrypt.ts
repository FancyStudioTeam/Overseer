import 'server-only';

import { createCipheriv, randomBytes } from 'node:crypto';
import { ENCRYPTION_ALGORITHM, ENCRYPTION_IV_LENGTH, ENCRYPTION_SECRET } from '#/lib/Constants.ts';

export function encrypt(unencryptedData: string): string {
	const iv = randomBytes(ENCRYPTION_IV_LENGTH);
	const cipher = createCipheriv(ENCRYPTION_ALGORITHM, ENCRYPTION_SECRET, iv);

	const encrypted = cipher.update(unencryptedData, 'utf-8');

	const final = cipher.final();
	const authTag = cipher.getAuthTag();

	const encryptedBuffer = Buffer.concat([
		encrypted,
		final,
	]);

	const encryptedBufferData = Buffer.concat([
		iv,
		authTag,
		encryptedBuffer,
	]);
	const encryptedBufferString = encryptedBufferData.toString('base64');

	return encryptedBufferString;
}
