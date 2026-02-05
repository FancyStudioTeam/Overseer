import 'server-only';

import { AES, enc } from 'crypto-js';
import { ENCRYPTION_KEY } from './Constants.ts';

export class Encryption {
	static decrypt(encryptedData: string): string {
		const unencryptedBytes = AES.decrypt(encryptedData, ENCRYPTION_KEY);
		const unencryptedString = unencryptedBytes.toString(enc.Utf8);

		return unencryptedString;
	}

	static encrypt(unencryptedData: string): string {
		const encryptedBytes = AES.encrypt(unencryptedData, ENCRYPTION_KEY);
		const encryptedString = encryptedBytes.toString();

		return encryptedString;
	}
}
