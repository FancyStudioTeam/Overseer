import chalk from 'chalk';
import { CodeBlockLanguage, codeBlock } from 'linkcord/utils';

export function formatTextDisplayContent(content: string | string[], delimiter = '»'): string {
	let codeBlockContent: string;

	if (typeof content === 'string') {
		codeBlockContent = formatStringContent(content);
	} else {
		codeBlockContent = formatArrayContent(content, delimiter);
	}

	return codeBlock(CodeBlockLanguage.ANSI, codeBlockContent);
}

function formatArrayContent(content: string[], delimiter = '»'): string {
	const splitterRegex = new RegExp(`\\s*${delimiter}\\s*`);

	const contentPairs = content.map<ContentPair>((pair) => {
		const [key, value] = pair.split(splitterRegex);

		return [
			key,
			value,
		];
	});

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

function formatStringContent(content: string): string {
	return `» ${chalk.bold.cyan(content)}`;
}

type ContentPair = [
	Key: string,
	Value: string,
];
