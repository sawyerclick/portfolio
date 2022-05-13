<script>
	import site from '$lib/data/site';
	import '$lib/styles/post.postcss';
</script>

<main id="post" class="post p-8 mt-0 max-w-2xl m-auto min-h-screen">
	<a
		href="/"
		class="inline-block font-light leading-none styled-border px-2 py-2 text-sm  hover:-skew-x-12 hover:transition-all focus:transition-all focus:-skew-x-12"
	>
		&#8592; home
	</a>

	<h2 class="font-semibold tracking-tight mt-8 text-5xl">Hi! I'm Sawyer.</h2>

	<p class="body">
		I'm a data and graphics journalist living in Dripping Springs, Texas. My speciality is weaving
		narratives into data-driven graphics and front-end development. I work at <a
			class="text-link"
			rel="external"
			href={site.job.link}>{site.job.company}</a
		>
		as a {site.job.title}.
	</p>

	<p class="body">
		I've worked at Business Insider, The Wall Street Journal and NBC News. I've briefly freelanced
		for <a class="text-link" href="https://www.dallasnews.com/joppa" rel="external">
			The Dallas Morning News</a
		>
		and
		<a
			class="text-link"
			href="https://observablehq.com/@sawyerclick/impds-complaints-allegations-and-demographics"
			rel="external">NYU's Criminal Justice Lab</a
		>.
	</p>

	<p class="body">Here are a few of my skills:</p>

	<ul class="list-chevron marker:text-secondary list-inside">
		{#each ['Svelte', 'D3.js', 'GSAP', 'Python/Pandas', 'SQL', 'QGIS/Mapshaper'] as skill}
			<li>{@html skill}</li>
		{/each}
	</ul>

	<p class="body">Here are a few of my interests:</p>

	<ul class="list-chevron marker:text-secondary list-inside">
		{#each ['Mechanical keyboards', 'Reading', 'Punk music'] as interest}
			<li>{@html interest}</li>
		{/each}
	</ul>
</main>
