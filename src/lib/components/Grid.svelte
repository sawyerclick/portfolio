<script>
	import { flip } from 'svelte/animate';
	import Project from '$lib/components/Project.svelte';
	export let gridItems = [];
</script>

<ul
	id="graphics"
	class="w-full mx-auto grid px-6 gap-12 sm:gap-8 lg:gap-12 place-items-start grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
>
	{#each gridItems as project (project.title)}
		<li class="project relative w-full h-full" animate:flip>
			<Project {project} />
		</li>
	{/each}
</ul>
