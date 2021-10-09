<script context="module">
	export async function load({ page, fetch }) {
		const urls = ['/api/meta.json', '/api/clips/graphics.json'];
		const [meta, graphics] = await Promise.all(
			urls.map(async (url) => {
				const apiRes = await fetch(url);
				if (apiRes.ok) return apiRes.json();
				else throw new Error(apiRes);
			})
		);
		const slug = page.path;
		return {
			props: { meta, graphics, slug }
		};
	}
</script>

<script>
	import Icon from '$lib/helpers/Icon.svelte';
	import Icons from '$lib/Icons.svelte';
	import Project from '$lib/Project.svelte';
	import Meta from '$lib/Meta.svelte';
	import ForceWrapper from '$lib/chart/ForceWrapper.svelte';

	export let meta;
	export let graphics;
	export let slug;
</script>

<Meta meta={{ ...meta, slug }} />

<main class="z-10">
	<div id="landing" class="h-screen min-h-screen flex justify-start items-end overflow-x-hidden">
		<div
			class="chart absolute all-0 h-screen min-h-screen w-full overflow-y-hidden pointer-events-none -z-1"
		>
			<ForceWrapper {graphics} />
		</div>

		<div class="sm:ml-8 header mt-8 mr-2 mb-16 ml-4">
			<h1 class="text-shadow mb-1">Sawyer Click</h1>
			<h2 class="md:text-3xl sm:w-full text-2xl w-3/4 font-medium m-0 text-shadow leading-7">
				develops interactive graphics at
				<a
					href="https://www.businessinsider.com/category/sawyer-click"
					target="_blank"
					class="border-b-2 border-pink hover:border-b-4"
				>
					Business Insider
				</a>
			</h2>
			<div class="m-0 mt-5">
				<Icons />
			</div>
		</div>

		<div class="absolute bottom-2 right-4">
			<Icon name="chevron-down" width="3rem" height="3rem" />
		</div>
	</div>

	<div
		id="graphics"
		class="w-full grid px-2 mt-16 gap-4 place-items-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
	>
		{#each graphics as project}
			<Project {project} />
		{/each}
	</div>
</main>

<style>
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
</style>
