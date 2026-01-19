import createMdx from '@next/mdx';
import type { NextConfig } from 'next';

const withMdx = createMdx({
	extension: /\.(md|mdx)$/,
	options: {
		rehypePlugins: [],
		remarkPlugins: [
			'remark-gfm',
		],
	},
});

export default withMdx({
	experimental: {
		authInterrupts: true,
		viewTransition: true,
	},
	pageExtensions: [
		'md',
		'mdx',
		'ts',
		'tsx',
	],
	reactCompiler: true,
} as NextConfig);
