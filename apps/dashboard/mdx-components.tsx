import type { MDXComponents } from 'mdx/types';

const components: MDXComponents = {
	h1: ({ children }) => <h1 className='my-4 font-extrabold text-3xl'>{children}</h1>,
	h2: ({ children }) => <h2 className='my-2 font-extrabold text-2xl'>{children}</h2>,
	li: ({ children }) => <li className='text-neutral-400'>{children}</li>,
	p: ({ children }) => <p className='my-2 text-neutral-400'>{children}</p>,
};

// biome-ignore lint/style/useNamingConvention: (x)
export function useMDXComponents(): MDXComponents {
	return components;
}
