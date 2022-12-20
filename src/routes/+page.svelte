<script>
	import { setContext } from 'svelte';
	import { GithubIcon } from 'svelte-feather-icons';
	import Project from '$lib/components/Project.svelte';
	import Grid from '$lib/components/Grid.svelte';
	import CanvasWrapper from '$lib/components/hero/CanvasWrapper.svelte';
	import Carousel from '$lib/components/Carousel.svelte';
	import { viewport } from '$lib/stores';

	/** @type {import('./$types').PageData} */
	export let data;

	setContext('graphics', [...data.projects.pinned, ...data.projects.recent]);
</script>

<header
	id="home"
	class="h-screen min-h-screen flex justify-center items-center relative overflow-hidden"
>
	<div
		class="absolute inset-0 h-full min-h-screen w-full after:absolute after:z-1 after:inset-x-0 after:-bottom-2 after:h-24 after:w-full after:bg-gradient-to-t after:from-accent dark:after:from-primary"
	>
		<div class="h-full w-full origin-center scale-105">
			<CanvasWrapper />
		</div>
	</div>
</header>

<section id="pinned" class="my-24">
	<header
		class="sm:flex justify-between items-end px-6 pb-2 pt-4 mt-16 mb-8 border-b-1 border-primary dark:border-accent text-center md:text-left"
	>
		<h2 class="text-2xl normal-case leading-none font-sans font-bold md:text-left md:text-6xl">
			Selected works
		</h2>
	</header>

	<Grid>
		{#each data.projects.pinned as project (project.title)}
			<li class="project relative w-full h-full">
				<Project {project} />
			</li>
		{/each}
	</Grid>
</section>

<section id="recent" class="my-24">
	<header
		class="sm:flex justify-between items-end px-6 pb-2 pt-4 mt-16 mb-8 border-b-1 border-primary dark:border-accent text-center md:text-left"
	>
		<h class="text-2xl normal-case leading-none font-sans font-bold  md:text-left md:text-6xl">
			Recent works
		</h>
		<p class="sm:w-50 sm:text-right block font-light  italic text-xs leading-none -skew-x-12">
			scroll for more &rarr;
		</p>
	</header>

	<Carousel>
		{#each data.projects.recent as project (project.title)}
			<li class="project snap-center shrink-0 w-96 sm:snap-start">
				<Project {project} />
			</li>
		{/each}
	</Carousel>
</section>

<section id="open-source" class="my-24">
	<header
		class="sm:flex justify-between items-end px-6 pb-2 pt-4 mt-16 mb-8 border-b-1 border-primary dark:border-accent text-center md:text-left"
	>
		<h2 class="text-2xl normal-case leading-none font-sans font-bold  md:text-left md:text-6xl">
			Open source
		</h2>
	</header>

	<Grid>
		{#each data.openSource as { title, github, description }}
			<li class="h-full">
				<a
					class="styled-border no-hover-style block h-full text-xs group hover:text-secondary"
					href={github}
					target="_blank"
					rel="noopener noreferrer"
				>
					<div class="flex justify-between items-center">
						<h3
							class="my-2 pointer-events-auto font-bold tracking-tighter text-lg leading-none text-primary dark:text-accent group-hover:text-secondary"
						>
							{title}
						</h3>
						<GithubIcon size="1.75x" />
					</div>
					<p class="body my-1">{description}</p>
				</a>
			</li>
		{/each}
	</Grid>
</section>

<section id="awards" class="mt-24">
	<header
		class="sm:flex justify-between items-end px-6 pb-2 pt-4 mt-16 mb-8 border-b-1 border-primary dark:border-accent text-center md:text-left"
	>
		<h2 class="text-2xl normal-case leading-none font-sans font-bold  md:text-left md:text-6xl">
			Awards & more
		</h2>
	</header>
	<div class="flex flex-col mx-0 px-6">
		{#each data.awards as { award, project }, i}
			<article class="mt-6 flex flex-col sm:flex-row items-center">
				<div class="p-2">
					<a
						class="styled-border block body text-center sm:text-left"
						href={project.href}
						rel="noreferrer"
						target="_blank"
					>
						{project.name}
					</a>
				</div>
				<span class="font-bold text-2xl -skew-x-12 text-primary dark:text-white">
					{@html $viewport.width <= 640 ? '&#8595;' : '&#8594;'}
				</span>
				<div class="p-2">
					<a
						class="styled-border block body text-center sm:text-left"
						href={award.href}
						target="_blank"
						rel="noreferrer"
					>
						{award.name}
					</a>
				</div>

				{#if i < data.awards.length - 1 && $viewport.width < 640}
					<hr class="mt-6 w-64 max-w-[90%] m-auto border-primary dark:border-accent" />
				{/if}
			</article>
		{/each}
	</div>
</section>
