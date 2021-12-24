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
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
	import Meta from '$lib/components/Meta.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import '$lib/styles/font.css';
	import '$lib/styles/app.postcss';

	export let slug;
	export let title;
	export let tags;
	export let date;
	export let description;
	export let coverImagesUrl;
	export let related;

	const parse = (time) => timeFormat('%B %e, %Y')(timeParse('%Y-%m-%dT%H:%M:%S.%LZ')(time));
</script>

<Meta meta={{ title, description, slug }} />

<!-- <Nav /> -->

<main id="post" class="post p-8 mt-0 max-w-2xl m-auto min-h-screen">
	<article>
		<header class="mb-8">
			<!-- <Breadcrumbs /> -->
			<h1 class="text-5xl mt-0">{title}</h1>
			<hr class="border-secondary mt-1 mb-2" />
			<div class="font-mono flex justify-between leading-none">
				<a class="group" rel="external" target="_blank" href="https://twitter.com/sawyerdabear">
					Sawyer Click
				</a>
				<time datetime={date}>
					{parse(date)}
				</time>
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
		@apply font-serif leading-none mt-8 mb-4 pt-6;
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
		@apply px-1 mr-2 leading-none float-left  font-serif bg-primary text-accent dark:bg-accent dark:text-primary;
	}

	a:hover {
		@apply text-secondary;
	}
</style>
