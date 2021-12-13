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

	let scrollY;
</script>

<svelte:window bind:scrollY />

<Meta meta={{ ...meta, slug }} />

<Nav />

<main class="z-10 min-h-screen">
	<div id="home" class="h-screen min-h-screen flex justify-start items-end overflow-hidden">
		<div class="chart absolute all-0 h-full min-h-screen w-full">
			<CanvasWrapper />
		</div>
	</div>

	<section id="pinned">
		<h2 class="styled-border">📌 Selected work</h2>
		<Grid gridItems={pinned} />
	</section>

	<section id="recent">
		<h2 class="styled-border">👀 Recent work</h2>
		<Grid gridItems={recent} />
	</section>
</main>

<Footer />

<style lang="postcss" global>
	section {
		@apply my-24;
	}
	h2 {
		@apply max-w-xs py-2 mx-auto mt-16 mb-12 text-4xl shadow-md text-center normal-case;
	}

	.chart::before {
		content: '';
		z-index: 1;
		position: absolute;
		bottom: 0px;
		left: 0;
		right: 0;
		height: 30px;
		background: rgb(248, 248, 248);
		background: linear-gradient(0deg, rgba(248, 248, 248, 1) 20%, rgba(248, 248, 248, 0) 100%);
	}

	li.project:hover img {
		filter: grayscale(0);
	}
	li.project img {
		filter: grayscale(0.7);
	}
</style>
