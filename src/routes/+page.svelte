<script lang="ts">
	import md from '$lib/utils/md.js';
	import Separator from '$lib/components/furniture/Separator.svelte';

	/** @type {import('./$types').PageData} */
	export let data;

	console.log(data);
</script>

<header id="above-the-fold" aria-label="Above the fold" class="px-8 mb-16 mt-24">
	<h1 class="font-gothic text-8xl">Sawyer Click</h1>
</header>

<Separator --height="10px" />

{#if data?.projects?.pinned}
	<section id="pinned" class="mx-8 my-8">
		<h2 class="font-gothic text-6xl mb-4">Highlighted works</h2>
		<ol>
			{#each Object.values(data.projects.pinned) as project (project.title)}
				<li class="project snap-center shrink-0 w-96 sm:snap-start">
					<article>
						<h3 class="italic font-bold text-lg">
							<a href={project.link}>
								{project.title}
							</a>
						</h3>
					</article>
					<!-- <Project {project} /> -->
				</li>
			{/each}
		</ol>
	</section>
{/if}

<section id="open-source" class="mx-8 my-8">
	<h2 class="font-gothic text-6xl mb-4">Open Source</h2>
	<ul>
		<!-- {#each data.openSource as { title, github, description }}
			<li class="h-full">
				<a
					class="styled-border no-hover-style block h-full text-xs group"
					href={github}
					target="_blank"
					rel="noopener noreferrer"
				>
					<div class="flex justify-between items-center">
						<h3 class="my-2 pointer-events-auto font-bold tracking-tighter text-lg leading-none">
							{title}
						</h3>
					</div>
					<p class="body my-1">{description}</p>
				</a>
			</li>
		{/each} -->
	</ul>
</section>
