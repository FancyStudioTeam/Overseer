import chalk from 'chalk';

export function formatKeyValues(pairs: Pair[]): string {
	const largestKeyLengthCallback = (accumulator: number, [{ length }]: Pair) =>
		Math.max(accumulator, length);

	const largestKeyLength = pairs.reduce(largestKeyLengthCallback, 0);

	const formattedString = pairs
		.map(
			([key, value]) =>
				`${chalk.bold.magenta(key.padEnd(largestKeyLength))} » ${chalk.cyan(value)}`,
		)
		.join('\n');

	return formattedString;
}

type Pair = readonly [
	Key: string,
	Value: string,
];
