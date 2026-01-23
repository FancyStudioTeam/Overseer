import 'server-only';

import { createDecipheriv } from 'node:crypto';
import {
	ENCRYPTION_ALGORITHM,
	ENCRYPTION_IV_LENGTH,
	ENCRYPTION_SECRET,
	ENCRYPTION_TAG_LENGTH,
} from '#/lib/Constants.ts';

export function decrypt(encryptedData: string): string {
	const encryptedBufferData = Buffer.from(encryptedData, 'base64');

	const iv = encryptedBufferData.subarray(0, ENCRYPTION_IV_LENGTH);
	const authTag = encryptedBufferData.subarray(
		ENCRYPTION_IV_LENGTH,
		ENCRYPTION_IV_LENGTH + ENCRYPTION_TAG_LENGTH,
	);

	const encrypted = encryptedBufferData.subarray(ENCRYPTION_IV_LENGTH + ENCRYPTION_TAG_LENGTH);
	const decipher = createDecipheriv(ENCRYPTION_ALGORITHM, ENCRYPTION_SECRET, iv);

	decipher.setAuthTag(authTag);

	const decrypted = decipher.update(encrypted);
	const final = decipher.final();

	const decryptedBufferData = Buffer.concat([
		decrypted,
		final,
	]);
	const decryptedBufferString = decryptedBufferData.toString('utf-8');

	return decryptedBufferString;
}
