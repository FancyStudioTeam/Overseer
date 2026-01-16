/*
 * biome-ignore-all lint/style/useComponentExportOnlyModules: (x)
 */

import type { MDXComponents } from 'mdx/types';
import { twMerge } from 'tailwind-merge';

const SHARED_HEADING_STYLE = (className?: string) => twMerge('font-stardom uppercase tracking-tighter', className);
const SHARED_TEXT_STYLE = (className?: string) => twMerge('text-neutral-400', className);

const components: MDXComponents = {
	h1: ({ children }) => <h1 className={SHARED_HEADING_STYLE('text-3xl')}>{children}</h1>,
	h2: ({ children }) => <h2 className={SHARED_HEADING_STYLE('text-2xl')}>{children}</h2>,
	h3: ({ children }) => <h3 className={SHARED_HEADING_STYLE('text-xl')}>{children}</h3>,
	h4: ({ children }) => <h4 className={SHARED_HEADING_STYLE('text-lg')}>{children}</h4>,
	li: ({ children }) => <li className={SHARED_TEXT_STYLE()}>{children}</li>,
	p: ({ children }) => <p className={SHARED_TEXT_STYLE()}>{children}</p>,
	table: ({ children }) => <table className='w-full border-collapse'>{children}</table>,
	td: ({ children }) => <td className='px-4 py-2'>{children}</td>,
	th: ({ children }) => <th className='border bg-neutral-900 px-4 py-2 font-normal font-stardom uppercase'>{children}</th>,
	ul: ({ children }) => <ul className='list-inside list-disc'>{children}</ul>,
};

// biome-ignore lint/style/useNamingConvention: (x)
export function useMDXComponents(): MDXComponents {
	return components;
}
