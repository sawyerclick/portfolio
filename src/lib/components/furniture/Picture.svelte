<script>
	export let alt = 'hello world';
	export let slug = 'cloudkitchens-map';
	export let width = '380';
	export let height = '240';
	export let sizes = [600, 900, 1200];
	export let formats = ['avif', 'webp', 'jpeg'];
</script>

<picture>
	{#each formats as format}
		{#each sizes as size}
			<source srcset="/images/thumbnails/{slug}/{size}.{format}" type="image/{format}" />
		{/each}
	{/each}
	<img
		src="/images/thumbnails/{slug}/300.jpeg"
		{alt}
		{width}
		{height}
		loading="lazy"
		decoding="async"
		draggable="false"
		class="object-cover object-center w-full h-full m-auto"
	/>
</picture>

<style>
	:global(.picture-wrapper img) {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
</style>
