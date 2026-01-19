import 'server-only';

import { createDecipheriv } from 'node:crypto';
import { ENCRYPTION_ALGORITHM, ENCRYPTION_IV_LENGTH, ENCRYPTION_KEY, ENCRYPTION_TAG_LENGTH } from '../Constants.ts';

export function decrypt(encryptedData: string): string {
	const bufferData = Buffer.from(encryptedData, 'base64');

	const iv = bufferData.subarray(0, ENCRYPTION_IV_LENGTH);
	const tag = bufferData.subarray(ENCRYPTION_IV_LENGTH, ENCRYPTION_IV_LENGTH + ENCRYPTION_TAG_LENGTH);
	const data = bufferData.subarray(ENCRYPTION_IV_LENGTH + ENCRYPTION_TAG_LENGTH);

	const decipher = createDecipheriv(ENCRYPTION_ALGORITHM, ENCRYPTION_KEY, iv);

	decipher.setAuthTag(tag);

	const decryptedData = decipher.update(data);
	const final = decipher.final();

	const decryptedBuffer = Buffer.concat([
		decryptedData,
		final,
	]);
	const decryptedBufferString = decryptedBuffer.toString('utf-8');

	return decryptedBufferString;
}
