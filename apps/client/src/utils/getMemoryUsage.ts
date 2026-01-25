import { memoryUsage } from 'node:process';

const CONVERSION_FACTOR = 1_024;

/**
 * Gets the formatted memory usage string (in megabytes) from V8.
 */
export function getMemoryUsage() {
	const { heapUsed } = memoryUsage();
	const formattedMegaBytes = formatToMegaBytes(heapUsed);

	return `${formattedMegaBytes} MB` as const;
}

/**
 * Formats the provided bytes into megabytes.
 *
 * @param bytes - The bytes to convert into megabytes.
 */
function formatToMegaBytes(bytes: number): string {
	return (bytes / (CONVERSION_FACTOR * CONVERSION_FACTOR)).toFixed(2);
}
