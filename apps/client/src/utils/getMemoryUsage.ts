import { memoryUsage } from 'node:process';

const CONVERSION_FACTOR = 1_024;

export function getMemoryUsage() {
	const { heapUsed } = memoryUsage();
	const heapUsageInMegaBytes = convertToMegaBytes(heapUsed);

	return `${heapUsageInMegaBytes} MB` as const;
}

function convertToMegaBytes(bytes: number): string {
	return (bytes / (CONVERSION_FACTOR * CONVERSION_FACTOR)).toFixed(2);
}
