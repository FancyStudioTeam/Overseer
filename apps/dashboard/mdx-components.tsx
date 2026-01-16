import type { MDXComponents } from 'mdx/types';

const components: MDXComponents = {
	h1: ({ children }) => <h1 className='font-extrabold text-3xl'>{children}</h1>,
	h2: ({ children }) => <h2 className='font-extrabold text-2xl'>{children}</h2>,
	h3: ({ children }) => <h3 className='font-extrabold text-xl'>{children}</h3>,
	h4: ({ children }) => <h4 className='font-extrabold text-lg'>{children}</h4>,
	li: ({ children }) => <li className='text-neutral-400'>{children}</li>,
	p: ({ children }) => <p className='text-neutral-400'>{children}</p>,
	table: ({ children }) => <table className='w-full border-collapse'>{children}</table>,
	td: ({ children }) => <td className='border px-4 py-2'>{children}</td>,
	th: ({ children }) => <th className='border bg-neutral-900 px-4 py-2'>{children}</th>,
	ul: ({ children }) => <ul className='list-inside list-disc'>{children}</ul>,
};

// biome-ignore lint/style/useNamingConvention: (x)
export function useMDXComponents(): MDXComponents {
	return components;
}
