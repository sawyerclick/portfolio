<script context="module">
	export async function load({ page }) {
		return {
			props: {
				slug: page.path
			}
		};
	}
</script>

<script>
	import Breadcrumbs from '$lib/components/furniture/Breadcrumbs.svelte';
	import Meta from '$lib/components/furniture/Meta.svelte';
	import Footer from '$lib/components/furniture/Footer.svelte';

	// post-specific styles
	import '$lib/styles/post.postcss';

	export let slug;
	export let title;
	export let tags;
	export let date;
	export let description;
	export let coverImagesUrl;
	export let related;
</script>

<Meta meta={{ title, description, slug }} />

<main id="post" class="post p-8 mt-0 max-w-2xl m-auto min-h-screen">
	<article>
		<header class="mb-8">
			<!-- <Breadcrumbs /> -->
			<h1 class="text-xl font-semibold font-sans mt-0 leading-none text-shadow sm:text-6xl">
				{title}
			</h1>
			<hr class="border-secondary my-1.5 neon" />
			<div class="font-mono flex flex-wrap sm:flex-nowrap justify-between leading-none">
				<a
					class="group mr-3"
					rel="external"
					target="_blank"
					href="https://twitter.com/sawyerdabear"
				>
					Sawyer Click
				</a>
				<time datetime={date}>
					{date.slice(0, 10)}
				</time>
			</div>
		</header>
		<section>
			<slot />
		</section>
		<Footer />
	</article>
</main>
