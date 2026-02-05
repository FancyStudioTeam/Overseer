import 'server-only';
import { memoryUsage } from 'node:process';

const CONVERSION_FACTOR = 1_024;
const BYTES_IN_MEGABYTES = CONVERSION_FACTOR * CONVERSION_FACTOR;

export function getMemoryUsage() {
	const { heapUsed } = memoryUsage();
	const formattedMegaBytes = formatToMegaBytes(heapUsed);

	return `${formattedMegaBytes} MB` as const;
}

function formatToMegaBytes(bytes: number): string {
	return (bytes / BYTES_IN_MEGABYTES).toFixed(2);
}
