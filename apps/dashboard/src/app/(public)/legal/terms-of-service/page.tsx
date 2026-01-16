import Content from './content.mdx';

export default function () {
	return (
		<>
			<header className='grid h-50 place-content-center border-b bg-linear-to-br from-neutral-950 via-neutral-900 to-neutral-950 sm:h-75'>
				<section className='flex max-w-xl flex-col gap-4 p-8 text-center sm:p-12'>
					<h1 className='font-stardom text-3xl uppercase tracking-tighter sm:text-5xl'>Terms of Service</h1>
					<p className='hidden text-sm sm:block'>
						This document describes the terms and conditions of use and explains the rules you must follow when using our
						service.
					</p>
				</section>
			</header>
			<main className='flex flex-col gap-4 p-8 text-md sm:p-12'>
				<Content />
			</main>
		</>
	);
}
