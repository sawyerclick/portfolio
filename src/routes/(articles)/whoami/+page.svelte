<script>
	import { page } from '$app/stores';
</script>

<div class="p-8 max-w-3xl m-auto">
	<nav>
		<a href="/" class="font-gothic text-sm tracking-widest">&leftarrow; home</a>
	</nav>

	<main id="post" class="post">
		<p class="body">
			I'm a data and graphics journalist living in Texas. My speciality is weaving narratives into
			data-driven graphics and front-end development. I work at <a
				class="text-link"
				rel="external"
				href={$page.data.job.link}>{$page.data.job.company}</a
			>
			as a {$page.data.job.title}.
		</p>

		<p class="body">
			I've worked at Business Insider, The Wall Street Journal and NBC News. I've also done some
			work for for <a class="text-link" href="https://www.dallasnews.com/joppa" rel="external">
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
			{#each ['Svelte/SvelteKit', 'D3.js', 'GSAP', 'Python/Pandas', 'SQL', 'QGIS/Mapshaper'] as skill}
				<li>{@html skill}</li>
			{/each}
		</ul>

		<p class="body">Here are a few of my interests:</p>

		<ul class="list-chevron marker:text-secondary list-inside">
			{#each ['<a href="https://twitter.com/sawyerdabear/status/1412516384609812484" target="_blank" rel="noreferrer">Mechanical keyboards</a>', 'Reading <small>(sci-fi, biographies, classics)</small>', 'Punk & jazz music'] as interest}
				<li>{@html interest}</li>
			{/each}
		</ul>
	</main>
</div>
