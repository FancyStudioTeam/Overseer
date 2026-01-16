import Content from './content.mdx';

export default function () {
	return (
		<>
			<header className='grid h-50 place-content-center border-b bg-linear-to-t from-cyan-700 to-transparent sm:h-75'>
				<section className='flex max-w-xl flex-col gap-4 p-8 text-center sm:p-12'>
					<h1 className='font-extrabold text-3xl sm:text-5xl'>Terms of Service</h1>
					<p className='hidden text-sm sm:block'>
						This document sets out the terms and conditions of use that you must follow with regard to the use of our service.
					</p>
				</section>
			</header>
			<main className='flex flex-col gap-4 p-8 text-md sm:p-12'>
				<Content />
			</main>
		</>
	);
}
