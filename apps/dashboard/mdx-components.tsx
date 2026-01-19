import type { MDXComponents } from 'mdx/types';
import { twMerge } from 'tailwind-merge';

/*
 * biome-ignore lint/style/useNamingConvention: This naming convention comes
 * from an external API and cannot be overridden.
 */
export function useMDXComponents(): MDXComponents {
	const sharedHeadingStyle = (className?: string) =>
		twMerge('font-stardom uppercase tracking-tighter', className);
	const sharedTextStyle = (className?: string) => twMerge('text-neutral-400', className);

	return {
		h1: ({ children }) => <h1 className={sharedHeadingStyle('text-3xl')}>{children}</h1>,
		h2: ({ children }) => <h2 className={sharedHeadingStyle('text-2xl')}>{children}</h2>,
		h3: ({ children }) => <h3 className={sharedHeadingStyle('text-xl')}>{children}</h3>,
		h4: ({ children }) => <h4 className={sharedHeadingStyle('text-lg')}>{children}</h4>,
		li: ({ children }) => <li className={sharedTextStyle()}>{children}</li>,
		p: ({ children }) => <p className={sharedTextStyle()}>{children}</p>,
		table: ({ children }) => <table className='w-full border-collapse'>{children}</table>,
		td: ({ children }) => <td className='px-4 py-2'>{children}</td>,
		th: ({ children }) => (
			<th className='border bg-neutral-900 px-4 py-2 font-normal font-stardom uppercase'>
				{children}
			</th>
		),
		ul: ({ children }) => <ul className='list-inside list-disc'>{children}</ul>,
	};
}
