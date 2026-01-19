import 'server-only';

import { createCipheriv, randomBytes } from 'node:crypto';
import { ENCRYPTION_ALGORITHM, ENCRYPTION_IV_LENGTH, ENCRYPTION_KEY } from '../Constants.ts';

export function encrypt(unencryptedData: string): string {
	const iv = randomBytes(ENCRYPTION_IV_LENGTH);
	const cipher = createCipheriv(ENCRYPTION_ALGORITHM, ENCRYPTION_KEY, iv);

	const encryptedData = cipher.update(unencryptedData, 'utf-8');
	const final = cipher.final();
	const tag = cipher.getAuthTag();

	const encryptedBuffer = Buffer.concat([
		encryptedData,
		final,
	]);

	const bufferData = Buffer.concat([
		iv,
		tag,
		encryptedBuffer,
	]);
	const encryptedBufferString = bufferData.toString('base64');

	return encryptedBufferString;
}
