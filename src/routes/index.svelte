<script context="module">
	export async function load({ page, fetch }) {
		const urls = ['/api/meta.json', '/api/lead-graphics.json'];
		const [meta, graphics] = await Promise.all(
			urls.map(async (url) => {
				const apiRes = await fetch(url);
				if (apiRes.ok) return apiRes.json();
				else throw new Error(apiRes);
			})
		);
		return {
			props: { meta, graphics, slug: page.path }
		};
	}
</script>

<script>
	import { setContext } from 'svelte';
	import Nav from '$lib/Nav.svelte';
	import Meta from '$lib/Meta.svelte';
	import Project from '$lib/Project.svelte';
	import CanvasWrapper from '$lib/hero/CanvasWrapper.svelte';

	export let meta;
	export let graphics;
	export let slug;

	setContext('graphics', graphics);

	let scrollY;
</script>

<svelte:window bind:scrollY />

<Meta meta={{ ...meta, slug }} />

<Nav />

<main class="z-10">
	<div id="home" class="h-screen min-h-screen flex justify-start items-end overflow-hidden ">
		<div class="chart absolute all-0 h-screen min-h-screen w-full overflow-y-hidden">
			<!-- <ForceWrapper {graphics} /> -->
			<CanvasWrapper />
		</div>
	</div>

	<ul
		id="graphics"
		class="w-full mx-auto grid px-6 mt-24 gap-12 sm:gap-8 lg:gap-12 place-items-start grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
	>
		{#each graphics as project}
			<li
				class="project relative w-full p-4 text-blue shadow-none border border-blue bg-grey rounded-tl-3xl rounded-br-3xl transition-all duration-300 hover:border-pink hover:rounded-tl-none hover:rounded-br-none hover:rounded-tr-3xl hover:rounded-bl-3xl hover:-translate-y-2 hover:shadow-md hover:z-0"
			>
				<Project {project} />
			</li>
		{/each}
	</ul>
</main>

<footer class="text-center mt-12 mb-20 mx-auto">
	<p class="font-serif">
		Made with 🖤 by <a href="https://www.twitter.com/sawyerdabear">Sawyer Click</a> in Dripping Springs,
		Texas
	</p>
</footer>

<style global>
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
