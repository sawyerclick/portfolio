<script>
	import Meta from '$lib/components/furniture/Meta.svelte';

	// post-specific styles
	import '$lib/styles/post.postcss';

	export let title;
	export let tags;
	export let date;
	export let description;
	export let coverImagesUrl;
	export let related;
</script>

<Meta meta={{ title, description }} />

<main id="post" class="post p-8 mt-0 max-w-2xl m-auto min-h-screen">
	<article>
		<header class="mb-8">
			<h1 class="text-xl font-semibold font-sans mt-0 leading-none text-shadow sm:text-6xl">
				{title}
			</h1>
			<hr class="border-secondary mt-2 mb-3 neon" />
			<div class="font-mono flex flex-wrap sm:flex-nowrap justify-between leading-none">
				<a
					class="group mr-3"
					rel="external author noreferrer"
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
	</article>
</main>
