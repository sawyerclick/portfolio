<script>
	export let alt = 'hello world';
	export let name = 'cloudkitchens-map';

	const imgSizes = [200, 400];
	const formats = ['png', 'webp'];

	const sizes = '(min-width: 1280px) 400px';

	const sources = formats.map((format) => ({
		format,
		srcset: imgSizes.map((size) => `/images/portfolio/resized/${name}/${size}.${format} ${size}w`)
	}));

	const src = name.includes('https://')
		? name + '&width=10&blur=10'
		: `/images/portfolio/resized/${name}/blurred.jpeg`;
</script>

<picture class="object-contain object-center w-full m-auto">
	{#if name.includes('https://')}
		<source
			{sizes}
			srcset={imgSizes.map((size) => `${name}&width=${size} ${size}w`)}
			type="image/jpeg"
		/>
	{:else}
		{#each sources as { format, srcset }}
			<source {sizes} {srcset} type="image/{format}" />
		{/each}
	{/if}
	<img
		class="object-contain object-center w-full m-auto"
		{src}
		{alt}
		loading="lazy"
		decoding="async"
		width="300"
		height="300"
	/>
</picture>
