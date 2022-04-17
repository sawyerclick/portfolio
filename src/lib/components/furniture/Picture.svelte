<script>
	import { Picture } from 'svelte-lazy-loader';

	export let alt = 'hello world';
	export let slug = 'cloudkitchens-map';

	const sizes = [400, 600, 800, 1000];
	const formats = ['avif', 'webp', 'jpeg'];
</script>

<Picture
	placeholder="/images/thumbnails/{slug}/blurred.jpeg"
	src="/images/thumbnails/{slug}/400.jpeg"
	{alt}
	loading="lazy"
	decoding="async"
	draggable="false"
	classes="object-cover object-center w-full h-full m-auto"
>
	{#each formats as format}
		{#each sizes as size}
			<source data-srcset="/images/thumbnails/{slug}/{size}.{format}" type="image/{format}" />
		{/each}
	{/each}
</Picture>

<style>
	:global(.picture-wrapper img) {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
</style>
