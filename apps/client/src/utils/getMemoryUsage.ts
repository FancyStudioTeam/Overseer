import { memoryUsage } from 'node:process';

const CONVERSION_FACTOR = 1_024;

/**
 * Gets the formatted memory usage of V8.
 *
 * @returns A string containing the memory usage in megabytes.
 */
export function getMemoryUsage() {
	const { heapUsed } = memoryUsage();
	const heapUsageInMegaBytes = convertToMegaBytes(heapUsed);

	return `${heapUsageInMegaBytes} MB` as const;
}

/**
 * Converts the provided bytes into megabytes.
 *
 * @param bytes - The bytes to convert into megabytes.
 * @returns The converted bytes into megabytes.
 */
function convertToMegaBytes(bytes: number): string {
	return (bytes / (CONVERSION_FACTOR * CONVERSION_FACTOR)).toFixed(2);
}
