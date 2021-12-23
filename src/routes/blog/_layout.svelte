<script context="module">
	export async function load({ page }) {
		return {
			props: {
				slug: page.path
			}
		};
	}
</script>

<script>
	import { timeFormat, timeParse } from 'd3-time-format';
	import Breadcrumbs from '$lib/Breadcrumbs.svelte';
	import Meta from '$lib/Meta.svelte';
	import Footer from '$lib/Footer.svelte';
	import '$styles/font.css';
	import '$styles/app.postcss';

	export let slug;
	export let title;
	export let created;
	export let updated;
	export let description;
	export let coverImagesUrl;
	export let related;

	const parse = (time) => timeFormat('%B %e, %Y')(timeParse('%Y-%m-%dT%H:%M:%S.%LZ')(time));

	const splitter = '<span class="pointer-events-none">&times;&times;&times;</span>';
</script>

<Meta meta={{ title, description, slug }} />

<!-- <Nav /> -->

<main id="post" class="blog p-8 mt-4 max-w-2xl m-auto">
	<article>
		<header class="mb-8">
			<Breadcrumbs />
			<h1 class="text-5xl mt-4 mb-2">{title}</h1>
			<hr class="bg-primary" />
			<div class="font-mono relative pt-2 border-t-1 border-primary">
				<a target="_blank" href="https://twitter.com/sawyerdabear"> Sawyer Click </a>
				{@html splitter}
				<time datetime={created}>
					{parse(created)}
				</time>
				{#if updated}
					{@html splitter}
					<time datetime={updated}>
						Updated: {parse(updated)}
					</time>
				{/if}
			</div>
		</header>
		<section>
			<slot />
		</section>
		<Footer />
	</article>
</main>

<style global lang="postcss">
	h2,
	h3,
	h4,
	h5,
	h6 {
		@apply font-serif text-primary leading-none mt-8 mb-4 pt-6;
	}
	h2 {
		@apply text-3xl uppercase;
	}

	p {
		@apply font-mono text-xl;
	}
	p.body {
		@apply my-4;
	}
	p.body:first-of-type::first-letter {
		font-size: 280%;
		@apply font-serif bg-primary text-accent px-1 mr-2 leading-none float-left;
	}

	a:hover {
		color: var(--secondary);
	}
</style>
