<script>
	import { flip } from 'svelte/animate';
	import Project from '$lib/components/Project.svelte';
	export let items = [];
</script>

<ul
	id="graphics"
	class="w-full mx-auto grid px-6 py-4 gap-4 lg:gap-6 place-items-start grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
>
	{#each items as project (project.title)}
		<li class="project relative w-full h-full" animate:flip>
			<Project {project} />
		</li>
	{/each}
</ul>
