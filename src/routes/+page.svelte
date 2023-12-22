<script lang="ts">
	import md from '$lib/utils/md.js';
	import Separator from '$lib/components/furniture/Separator.svelte';
	import Picture from '$lib/components/furniture/Picture.svelte';

	export let data;
</script>

<section id="above-the-fold" aria-label="Above the fold" class="px-8 my-8">
	<h2 class="sr-only">Above the fold. A curated selection of my work and articles.</h2>
	<div class="articles">
		<div class="col-span-6">
			<article
				class="article feature border-l-0 border-t-0 p-3 group"
				data-speed="auto"
				data-lag="2"
			>
				<a href={data.projects.feature.link} target="_blank" rel="noreferrer">
					<h3
						class="hed font-black italic text-5xl -translate-x-1 leading-snug -mb-2 -translate-y-6"
					>
						{data.projects.feature.title}
					</h3>
					<div>
						<Picture
							src={data.projects.feature.img}
							alt={data.projects.feature.title}
							class="lg:float-left lg:mr-6 mb-6 max-w-[400px] grayscale"
							width={400}
							height={400}
							loading="eager"
						/>
						<div class="byline">
							<p>For <b>{data.projects.feature.client}</b></p>
							<span>❦</span>
							<p><time>{data.projects.feature.date}</time></p>
						</div>
						{@html md(data.projects.feature.description, { class: 'article-description' })}
					</div>
				</a>
			</article>
		</div>
		<div class="col-span-3">
			<article>
				<a href="/whoami" aria-labelledby="whoami-right-rail" class="group">
					<h3 id="whoami-right-rail" class="hed font-black italic text-3xl mb-2 -translate-x-1">
						Who Am I?
					</h3>
					<div class="grid grid-cols-3 gap-3">
						<p class="col-span-2 group-hover:underline group-focus:underline">
							I'm a data and graphics journalist born and raised in Texas. My speciality is weaving
							narratives into stats-driven graphics, often using novel databases.
						</p>
						<img
							class="col-span-1 grayscale"
							src="images/me.jpeg"
							width="200"
							height="200"
							alt="Sawyer Click"
							loading="eager"
						/>
					</div>
				</a>
			</article>
			<Separator class="my-6" />
			<article>
				<a href="/" class="group">
					<h3 class="hed font-black italic text-3xl mb-2 -translate-x-1">
						Lorem ipsum dolor, sit amet consectetur adipisicing elit
					</h3>
					<div class="grid grid-cols-3 gap-3">
						<p class="col-span-2 group-hover:underline group-focus:underline">
							Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas molestias,
							dignissimos delectus eum officia aspernatur saepe nihil.
						</p>
						<img
							class="col-span-1"
							src="https://via.placeholder.com/200x200.png"
							width="200"
							height="200"
							alt=""
						/>
					</div>
				</a>
			</article>
		</div>
	</div>
</section>

<div class="md:px-8">
	<Separator />
</div>

<section id="recent" class="mx-8 my-8">
	<h2 class="font-gothic text-6xl mb-4">Recent works</h2>
	<ol>
		{#each data.projects.recent as project (project.title)}
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

<section id="open-source" class="mx-8 my-8">
	<h2 class="font-gothic text-6xl mb-4">Open Source</h2>
	<ul>
		{#each data.openSource as { title, github, description }}
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
		{/each}
	</ul>
</section>

<!-- <section id="pinned" class="my-24">
	<header
		class="sm:flex justify-between items-end px-6 pb-2 pt-4 mt-16 mb-8 border-b-1 border-primary dark:border-accent"
	>
		<h2
			class="text-2xl normal-case leading-none font-gothic font-bold md:text-6xl text-center mx-auto"
		>
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
</section> -->
