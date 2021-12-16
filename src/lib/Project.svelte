<script>
	import { slide } from 'svelte/transition';
	import Picture from './Picture.svelte';
	export let project;

	let { link, img, alt, title, publication, date, description } = project;
</script>

<a
	class="group styled-border block h-full text-blue shadow-md relative z-100 hover:shadow-xl hover:-rotate-2 hover:-translate-y-4"
	href={link}
	target="_blank"
	{title}
>
	<div class="flex justify-center items-end flex-row flex-wrap">
		<div
			class="picture-wrapper h-60 w-full border-b border-blue object-center object-cover overflow-hidden z-0 transition-all duration-300 group-hover:border-pink"
		>
			<Picture slug={img} {alt} />
		</div>
		<span transition:slide|local class="text-left w-full px-4 my-2 pt-1.5">
			<ul>
				<li
					class="publication inline-block px-1.5 py-0.5 leading-none mr-1.5 rounded-sm font-mono text-sm text-blue border-1 border-blue"
				>
					{publication}
				</li>
				<li
					class="date inline-block px-1.5 py-0.5 leading-none mr-1.5 rounded-sm font-mono text-sm text-blue border-1 border-blue"
				>
					{date}
				</li>
			</ul>
			<!-- <ul>
				{#each project.tags.split(',') as tag}
					<li>
						{tag}
					</li>
				{/each}
			</ul> -->
			<h3 class="font-serif text-3xl w-full m-0 mt-3 mb-2 transition-all duration-200">
				{title}
			</h3>
			<p class="font-mono text-lg leading-5 m-0 mt-2 mb-2 w-full">
				{description}
			</p>
		</span>
	</div>
</a>

<style lang="postcss">
	a {
		padding: 0 !important;
	}
	a .picture-wrapper :global(img) {
		@apply transition-transform duration-300 ease-out;
	}
	a:hover .picture-wrapper :global(img) {
		@apply scale-105;
	}
</style>
