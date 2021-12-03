<script>
	import Meta from '$lib/Meta.svelte';
</script>

<Meta meta={{ title: 'Whoops...', description: 'Something went wrong.', slug: '' }} />

<picture class="w-screen h-screen fixed pointer-events-none -z-1">
	<source srcset="/images/rickroll.webp" type="image/webp" />
	<source srcset="/images/rickroll.gif" type="image/gif" />
	<img
		src="/images/rickroll.gif"
		alt="Rick Roll gif"
		class="w-full h-full object-center object-cover"
	/>
</picture>

<main class="flex flex-nowrap flex-col justify-center items-center h-screen p-12 text-center">
	<h1 class="font-serif mt-8 text-bg">Whoops...</h1>
	<h2 class="font-serif mt-6 text-5xl text-bg">something went wrong</h2>
	<button
		on:click={() => window.location.reload()}
		class="styled-border font-serif mt-8 px-3 py-1 text-2xl"
	>
		Try again?
	</button>
</main>
