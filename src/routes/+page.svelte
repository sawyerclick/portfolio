<script>
	import { setContext } from 'svelte';
	import { slide } from 'svelte/transition';
	import { GithubIcon } from 'svelte-feather-icons';
	import { timeFormat } from 'd3';
	import { prefersReducedMotion, viewport } from '$lib/stores';
	import timeline from '$lib/actions/timeline';
	import Project from '$lib/components/Project.svelte';
	import Grid from '$lib/components/Grid.svelte';
	import Carousel from '$lib/components/Carousel.svelte';
	import Separator from '$lib/components/furniture/Separator.svelte';

	/** @type {import('./$types').PageData} */
	export let data;

	setContext('graphics', [...data.projects.pinned, ...data.projects.recent]);

	// marquee stuff
	const marqueeInterval = 5000;
	const marquees = [
		{ noun: 'pixels', verb: 'push' },
		{ noun: 'data', verb: 'chart' },
		{ noun: 'stories', verb: 'tell' },
		{ noun: 'juice', verb: 'squeeze' },
		{ noun: 'code', verb: 'ship' }
	];
	let activeMarqueeIndex = 0;
	const marqueeTimer = setInterval(() => {
		activeMarqueeIndex = activeMarqueeIndex === marquees.length - 1 ? 0 : activeMarqueeIndex + 1;
	}, marqueeInterval);

	// time stuff
	let showSeconds = true;
	let todaysDate = Date.now();
	const todaysDateTimer = setInterval(() => (todaysDate = Date.now()), 1000);

	// optionally stop timers based on user pref
	$: if ($prefersReducedMotion) {
		clearInterval(marqueeTimer);
		clearInterval(todaysDateTimer);
	}
</script>

<!-- https://greensock.com/forums/topic/32705-scrollsmoother-and-position-sticky/ -->

<header id="hero" class="grid grid-cols-9 grid-rows-1 gap-3 overflow-hidden pt-4 px-8">
	<div class="col-start-4 col-end-7 text-center">
		<h1 class="lowercase row-start-1 sticky top-0">Sawyer Click</h1>
		<p class="sr-only">Data viz reporter</p>
	</div>

	<div class="col-start-1 col-end-3 row-start-1 flex items-center">
		<p class="border border-black p-3 text-center inline-block text-sm">
			<!-- TODO: scramble letter effect -->
			{#key activeMarqueeIndex}
				All the <span>{marquees[activeMarqueeIndex].noun}</span> fit to
				<span>{marquees[activeMarqueeIndex].verb}</span>.
			{/key}
		</p>
	</div>

	<div class="col-start-8 col-end-10 row-start-1 flex items-center justify-end">
		<button
			title="Today's date, local time. Click to disable blinking."
			class="border border-black p-3 text-center text-sm flex items-center justify-center overflow-hidden"
			on:click={() => (showSeconds = !showSeconds)}
		>
			<div>{timeFormat('%B %d, %Y %I:%M')(todaysDate)}</div>
			{#if showSeconds && !$prefersReducedMotion}
				<div class="whitespace-nowrap" transition:slide|local={{ axis: 'x' }}>
					<span>::</span><span>{timeFormat('%Ss %p')(todaysDate)}</span>
				</div>
			{/if}
		</button>
	</div>
</header>

<Separator class="mx-8 my-4" />

<section id="pinned" class="my-24">
	<header
		class="sm:flex justify-between items-end px-6 pb-2 pt-4 mt-16 mb-8 border-b-1 border-primary dark:border-accent"
	>
		<h2 class="text-2xl normal-case leading-none font-gothic font-bold md:text-6xl text-center">
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
		<h class="text-2xl normal-case leading-none font-gothic font-bold md:text-left md:text-6xl">
			Recent works
		</h>
		<p class="sm:w-50 sm:text-right block font-light italic text-xs leading-none -skew-x-12">
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
		<h2 class="text-2xl normal-case leading-none font-gothic font-bold md:text-left md:text-6xl">
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
		<h2 class="text-2xl normal-case leading-none font-gothic font-bold md:text-left md:text-6xl">
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
