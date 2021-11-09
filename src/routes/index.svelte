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
	import { onMount } from 'svelte';
	import ForceWrapper from '$lib/chart/ForceWrapper.svelte';
	import Icon from '$lib/helpers/Icon.svelte';
	import Icons from '$lib/Icons.svelte';
	import Meta from '$lib/Meta.svelte';
	import Project from '$lib/Project.svelte';

	export let meta;
	export let graphics;
	export let slug;

	let mounted = false;
	onMount(() => {
		mounted = true;
	});
</script>

<Meta meta={{ ...meta, slug }} />

<main class="z-10">
	<div id="landing" class="h-screen min-h-screen flex justify-start items-end overflow-hidden">
		<div
			class="chart absolute all-0 h-screen min-h-screen w-full overflow-y-hidden pointer-events-none -z-1"
		>
			<ForceWrapper {graphics} />
		</div>

		{#if mounted}
			<div class="sm:ml-8 header mt-8 mr-2 mb-16 ml-4">
				<div>
					<h1 class="text-shadow mb-1 my-2 font-extralight">
						<!-- {#each 'Sawyer Click' as letter, i}
							<span class="inline-block" class:mr-4={letter === 'r'}>
								{@html letter}
							</span>
						{/each} -->
						Sawyer Click
					</h1>
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
				</div>
				<div class="m-0 mt-5">
					<Icons />
				</div>
			</div>
		{/if}

		<div class="absolute bottom-2 right-4">
			<Icon name="chevron-down" width="3rem" height="3rem" />
		</div>
	</div>

	<ul
		id="graphics"
		class="w-full mx-auto grid px-6 mt-24 gap-12 sm:gap-8 lg:gap-12 place-items-center grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
	>
		{#each graphics as project}
			<li
				class="project relative w-full rounded-lg p-4 text-blue shadow-none border-1 border-blue sm:border-transparent transition-all duration-300 hover:-translate-y-2 hover:shadow-md hover:border-blue"
			>
				<Project {project} />
			</li>
		{/each}
	</ul>
</main>

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
