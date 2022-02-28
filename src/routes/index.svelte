<script>
	import { setContext } from 'svelte';
	import { ArrowRightIcon } from 'svelte-feather-icons';
	import Meta from '$lib/components/furniture/Meta.svelte';
	import Grid from '$lib/components/Grid.svelte';
	import CanvasWrapper from '$lib/components/hero/CanvasWrapper.svelte';
	import Footer from '$lib/components/furniture/Footer.svelte';
	import Carousel from '$lib/components/Carousel.svelte';

	import meta from '$lib/data/meta.js';
	import projects from '$lib/data/projects.js';
	import awards from '$lib/data/awards.csv';

	setContext('graphics', [...projects.pinned, ...projects.recent]);
</script>

<Meta meta={{ ...meta, slug: '' }} />

<main class="z-10 min-h-screen">
	<div
		id="home"
		class="h-screen min-h-screen flex justify-start items-end relative"
		style="height:100vh;"
	>
		<div
			class="absolute all-0 h-full min-h-screen w-full after:absolute after:z-1 after:right-0 after:bottom-0 after:left-0 after:h-24 after:w-full after:bg-gradient-to-b after:from-transparent after:to-accent dark:after:to-primary"
		>
			<CanvasWrapper />
		</div>
	</div>

	<section id="pinned" class="my-24">
		<div
			class="sm:flex justify-between items-end px-6 pb-2 pt-4 mt-16 mb-8 border-b-1 border-primary dark:border-accent text-center md:text-left"
		>
			<h1 class="text-2xl normal-case leading-none font-sans font-bold  md:text-left md:text-6xl">
				Selected works
			</h1>
		</div>
		<Grid items={projects.pinned} />
	</section>

	<section id="recent" class="my-24">
		<div
			class="sm:flex justify-between items-end px-6 pb-2 pt-4 mt-16 mb-8 border-b-1 border-primary dark:border-accent text-center md:text-left"
		>
			<h1 class="text-2xl normal-case leading-none font-sans font-bold  md:text-left md:text-6xl">
				Recent works
			</h1>
			<span class="sm:w-50 font-light text-right italic text-xs leading-none -skew-x-12">
				scroll for more
				<ArrowRightIcon size="14" />
			</span>
		</div>
		<Carousel items={projects.recent} />
	</section>

	<section id="awards" class="my-24">
		<div
			class="sm:flex justify-between items-end px-6 pb-2 pt-4 mt-16 mb-8 border-b-1 border-primary dark:border-accent text-center md:text-left"
		>
			<h1 class="text-2xl normal-case leading-none font-sans font-bold  md:text-left md:text-6xl">
				Awards & more
			</h1>
		</div>
		<table class="px-6 border-collapse border-spacing-[15px] table-auto max-w-4xl mx-auto">
			<thead class="table-header-group">
				<th>Project</th>
				<th />
				<th>Award || Event</th>
			</thead>
			<tbody class="font-mono tracking-wide">
				{#each awards as { awardLink, awardName, projectLink, projectName }}
					<tr>
						<td class="p-4">
							<a
								class="styled-border block font-mono leading-tight"
								href={projectLink}
								target="_blank"
							>
								{projectName}
							</a>
						</td>
						<td class="font-bold text-2xl -skew-x-12 text-primary">&#8594;</td>
						<td class="p-4">
							<a
								class="styled-border block font-mono leading-tight"
								href={awardLink}
								target="_blank"
							>
								{awardName}
							</a>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</section>
</main>

<Footer />
