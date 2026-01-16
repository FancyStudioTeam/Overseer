import Content from './content.mdx';

export default function () {
	return (
		<>
			<header className='grid h-75 place-content-center border-b bg-linear-to-t from-cyan-700 to-transparent'>
				<section className='flex max-w-xl flex-col gap-4 p-8 text-center'>
					<h1 className='font-extrabold text-3xl sm:text-5xl'>Privacy Policy</h1>
					<p className='text-md'>
						This document describes the privacy policy and explains how data is collected, used, and protected in relation to
						the use of our service.
					</p>
				</section>
			</header>
			<main className='flex flex-col gap-4 p-8 text-md'>
				<Content />
			</main>
		</>
	);
}
