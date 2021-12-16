<script context="module">
	export async function load({ fetch }) {
		const res = await fetch('/api/awards.json');
		const awards = await res.json();
		return {
			props: { awards }
		};
	}
</script>

<script>
	import Meta from '$lib/Meta.svelte';
	import Footer from '$lib/Footer.svelte';

	export let awards = [];
</script>

<Meta
	meta={{
		title: 'Awards & such',
		slug: 'awards',
		description: 'Awards and other notable accomplishments'
	}}
/>

<main class="min-h-screen pt-12">
	<section id="awards-and-such">
		<nav class="block text-center">
			<a class="styled-border text-lg inline-block" href="/">home</a>
		</nav>

		<header class="mt-8">
			<figure class="text-center text-3xl">🏆</figure>
			<h1 class="text-center font-serif mt-2 mb-4 px-2 text-5xl">Awards & such</h1>
		</header>

		<ul class="w-full mx-auto px-6">
			{#each awards as { awardLink, awardName, projectLink, projectName }}
				<li class="block align-middle text-center max-w-md mx-auto my-6 styled-border">
					<a href={awardLink} class="block font-sans leading-tight py-1 max-w-sm mx-auto">
						<b>{awardName}</b>
					</a>
					<hr class="my-2 border-blue opacity-40" />
					<a href={projectLink} class="block font-serif leading-tight py-1 max-w-sm mx-auto">
						{projectName}
					</a>
				</li>
			{/each}
		</ul>
	</section>
</main>

<Footer />
