<script>
	import Meta from '$lib/components/furniture/Meta.svelte';
</script>

<Meta meta={{ title: 'Whoops...', description: 'Something went wrong.', slug: '' }} />

<picture class="w-screen h-screen fixed pointer-events-none z-10">
	<source srcset="/images/rickroll.webp" type="image/webp" />
	<source srcset="/images/rickroll.gif" type="image/gif" />
	<img
		src="/images/rickroll.gif"
		alt="Rick Roll gif"
		class="w-full h-full object-center object-cover"
	/>
</picture>

<main
	class="absolute flex flex-nowrap flex-col justify-center items-center w-screen h-screen p-12 text-center z-20"
>
	<h1 class="font-sans font-bold mt-8 text-bg text-accent -skew-x-12">Whoops...</h1>
	<h2 class="font-sans font-bold mt-6 text-5xl text-bg text-accent -skew-x-12">
		something went wrong
	</h2>
	<a sveltekit:prefetch href="/" class="styled-border font-sans mt-8 px-3 py-1 text-2xl -skew-x-12">
		Go home?
	</a>
</main>
