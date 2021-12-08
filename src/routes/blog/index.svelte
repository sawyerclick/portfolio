<script context="module">
	export async function load({ page, fetch }) {
		const res = await fetch('/api/blog.json');
		const { blogs } = await res.json();
		const slug = page.path;
		return {
			props: {
				blogs,
				slug
			}
		};
	}
</script>

<script>
	import { timeFormat, timeParse } from 'd3-time-format';
	import Meta from '$lib/Meta.svelte';
	import Footer from '$lib/Footer.svelte';
	const parse = (time) => timeFormat('%Y-%m')(timeParse('%Y-%m-%dT%H:%M:%S.%LZ')(time));
	export let blogs = [],
		slug;
</script>

<Meta
	meta={{
		title: 'Blog',
		description: "Thoughts, musings and otherwise dumb ideas I've had.",
		slug
	}}
/>

<main class="max-w-lg mx-auto px-6 pt-12 min-h-screen">
	<article>
		<header>
			<nav class="left-2 top-2 static block text-center">
				<a class="styled-border text-lg" href="/" sveltekit:prefetch>home</a>
			</nav>

			<h1 class="font-serif text-5xl text-center mt-6 font-black tracking-wider">
				Sawyer's musings
			</h1>
		</header>

		<ul class="font-mono mt-4 w-full">
			{#each blogs as { slug, created }}
				<li class="text-lg w-full font-light ">
					<a href="/blog/{slug}" class="styled-border w-full flex justify-between">
						<span>&gt;&nbsp;<b>{slug}</b></span>
						<span>{parse(created)}</span>
					</a>
				</li>
			{/each}
		</ul>
	</article>
</main>

<Footer />

<style lang="postcss">
	a:hover * {
		color: var(--pink);
	}
</style>
