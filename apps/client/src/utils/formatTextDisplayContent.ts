import chalk from 'chalk';
import { CodeBlockLanguage, codeBlock } from 'linkcord/utils';

/**
 * Formats the provided content into an ANSI codeblock.
 *
 * @param content - The content to format.
 * @param delimiter - The delimiter that will split the pairs into key-values.
 *
 * @returns The formatted ANSI codeblock.
 *
 * @remarks
 * If you want to create one content pair, you must use an array with one
 * element inside.
 */
export function formatTextDisplayContent(
	content: string | string[],
	delimiter = '»',
): string {
	let codeBlockContent: string;

	if (typeof content === 'string') {
		codeBlockContent = formatStringContent(content);
	} else {
		codeBlockContent = formatArrayContent(content, delimiter);
	}

	return codeBlock(CodeBlockLanguage.ANSI, codeBlockContent);
}

/**
 * Formats the provided array of content pair strings into an ANSI codeblock.
 *
 * @param content - The array of content pair strings to format.
 * @param delimiter - The delimiter that will split the pairs into key-values.
 *
 * @returns The formatted ANSI codeblock.
 */
function formatArrayContent(content: string[], delimiter = '»'): string {
	const splitterRegex = new RegExp(`\\s*${delimiter}\\s*`);

	const contentPairs = content.map<ContentPair>((pair) => {
		const [key, value] = pair.split(splitterRegex);

		return [
			key,
			value,
		];
	});

	/*
	 * Get the largest key length by getting the largest length between the
	 * accumulated length and the current length.
	 */
	const largestKeyLength = contentPairs.reduce(
		(accumulator, [{ length }]) => Math.max(accumulator, length),
		0,
	);

	const formattedString = contentPairs.map(([key, value]) => {
		const keyWithPadding = key.padEnd(largestKeyLength);
		const delimiterWithoutSpaces = delimiter.trim();

		const formattedKey = chalk.bold.cyan(keyWithPadding);
		const formattedDelimiter = chalk.reset.white(delimiterWithoutSpaces);
		const formattedValue = chalk.reset.white(value);

		return `» ${formattedKey} ${formattedDelimiter} ${formattedValue}`;
	});

	return formattedString.join('\n');
}

/**
 * Formats the provided content string into an ANSI codeblock.
 *
 * @param content - The content to format.
 * @returns The formatted ANSI codeblock.
 */
function formatStringContent(content: string): string {
	return `» ${chalk.bold.cyan(content)}`;
}

type ContentPair = [
	Key: string,
	Value: string,
];
