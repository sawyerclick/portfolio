<script>
	export let alt;
	export let src;
	export let width = 380;
	export let height = 240;
	export let sizes = [600, 900, 1200];
	export let formats = ['avif', 'webp', 'jpeg'];
	export let loading = 'lazy';

	let classes = '';
	export { classes as class };
</script>

<picture>
	{#each formats as format}
		{#each sizes as size}
			<source srcset="/images/thumbnails/{src}/{size}.{format}" type="image/{format}" />
		{/each}
	{/each}
	<img
		src="/images/thumbnails/{src}/300.jpeg"
		{alt}
		{width}
		{height}
		{loading}
		decoding="async"
		draggable="false"
		class="object-cover object-center w-full h-full m-auto {classes}"
	/>
</picture>

<style>
</style>
