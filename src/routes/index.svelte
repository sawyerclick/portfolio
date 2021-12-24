<script context="module">
	export async function load({ page, fetch }) {
		const urls = ['/api/meta.json', '/api/lead-graphics.json'];
		const [meta, projects] = await Promise.all(
			urls.map(async (url) => {
				const apiRes = await fetch(url);
				if (apiRes.ok) return apiRes.json();
				else throw new Error(apiRes);
			})
		);
		return {
			props: { meta, ...projects, slug: page.path }
		};
	}
</script>

<script>
	import { setContext } from 'svelte';
	import Nav from '$lib/Nav.svelte';
	import Meta from '$lib/Meta.svelte';
	import Grid from '$lib/Grid.svelte';
	import CanvasWrapper from '$lib/hero/CanvasWrapper.svelte';
	import Footer from '$lib/Footer.svelte';

	export let meta;
	export let pinned;
	export let recent;
	export let slug;

	setContext('graphics', [...pinned, ...recent]);
</script>

<Meta meta={{ ...meta, slug }} />

<Nav />

<main class="z-10 min-h-screen">
	<div
		id="home"
		class="h-screen min-h-screen flex justify-start items-end relative"
		style="height:100vh;"
	>
		<div
			class="absolute all-0 h-full min-h-screen w-full after:absolute after:z-1 after:right-0 after:bottom-0 after:left-0 after:h-24 after:w-full after:bg-gradient-to-b after:from-transparent after:to-accent dark:after:to-primary"
		>
			<CanvasWrapper />
		</div>
	</div>

	<section id="pinned" class="my-24">
		<h2
			class="px-6 pb-2 mt-16 mb-8 text-6xl normal-case font-serif border-b border-secondary text-center md:text-left"
		>
			Selected work
		</h2>
		<Grid gridItems={pinned} />
	</section>

	<section id="recent" class="my-24">
		<h2
			class="px-6 pb-2 mt-16 mb-8 text-6xl normal-case font-serif border-b  border-secondary shadow-secondary-lg text-center md:text-left"
		>
			Recent work
		</h2>
		<Grid gridItems={recent} />
	</section>
</main>

<Footer />

<style lang="postcss" global>
	li.project:hover img {
		filter: grayscale(0);
	}
	li.project img {
		filter: grayscale(0.7);
	}
</style>
