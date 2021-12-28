<script>
	import { flip } from 'svelte/animate';
	import Project from '$lib/components/Project.svelte';
	export let items = [];
</script>

<div class="w-full text-center overflow-x-hidden">
	<ul
		id="graphics"
		class="w-full mx-auto flex px-6 py-5 gap-4 lg:gap-6 place-items-start overflow-x-auto scroll-smooth snap-mandatory snap-x scroll-pl-6 [-webkit-overflow-scrolling:touch]"
	>
		{#each items as project (project.title)}
			<li class="project snap-start shrink-0" animate:flip>
				<Project {project} />
			</li>
		{/each}
	</ul>
</div>

<style lang="postcss">
	ul::-webkit-scrollbar {
		@apply h-2;
	}
	ul::-webkit-scrollbar-thumb {
		@apply bg-primary dark:bg-accent rounded-xl;
	}
	:global(.dark) ul::-webkit-scrollbar-thumb {
		@apply bg-accent;
	}
	ul::-webkit-scrollbar-track {
		@apply bg-transparent mx-6;
	}
</style>
