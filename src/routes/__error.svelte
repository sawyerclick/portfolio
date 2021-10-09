<script>
	import Meta from '$lib/Meta.svelte';
</script>

<Meta meta={{ title: 'Error', description: 'Whoops... something went wrong', slug: '' }} />

<picture class="w-screen h-screen fixed pointer-events-none -z-1">
	<source srcset="/static/images/rickroll.webp" type="image/webp" />
	<source srcset="/static/images/rickroll.gif" type="image/gif" />
	<img
		src="/static/images/rickroll.gif"
		alt="Rick Roll gif"
		class="w-full h-full object-center object-cover"
	/>
</picture>

<main class="flex flex-nowrap flex-col justify-center items-center h-screen p-12 text-center">
	<h1 class="font-serif mt-8 text-gray">Whoops...</h1>
	<h2 class="font-serif mt-6 text-5xl text-gray">something went wrong</h2>
	<a
		href="/"
		class="font-serif mt-8 text-2xl bg-blue text-gray px-3 py-1 rounded-lg transition hover:bg-pink hover:text-gray"
		>Go back home?</a
	>
</main>

<style>
	iframe * {
		object-fit: cover;
		object-position: center;
	}
</style>
