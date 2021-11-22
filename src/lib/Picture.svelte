<script>
	import { lazy } from '$stores';

	export let alt = 'hello world';
	export let name = 'cloudkitchens-map';

	const imgSizes = [200, 400];
	const formats = ['png', 'webp'];

	const sizes = '(min-width: 1280px) 400px';

	const srcSets = formats.map((format) => ({
		format,
		srcset: imgSizes.map((size) => `/images/portfolio/resized/${name}/${size}.${format} ${size}w`)
	}));

	const src = name.includes('https://')
		? name + '&width=10&blur=10'
		: `/images/portfolio/resized/${name}/blurred.jpeg`;

	// blurs up image after it's lazy loaded
	const imgBlurUp = (e) => {
		if (e.currentTarget.src === `${image}?width=350&dpr=2&format=jpeg&auto=webp&quality=100,100`) {
			e.currentTarget.classList.remove('img-blur-up');
		}
	};

	let imgEl;

	// setup lazyloading for images
	$: if ($lazy && imgEl) {
		$lazy.observe(imgEl);
		imgEl.addEventListener('load', imgBlurUp);
	}
</script>

<picture class="object-contain object-center w-full m-auto" bind:this={imgEl}>
	{#if name.includes('https://')}
		<source
			{sizes}
			srcset={imgSizes.map((size) => `${name}&width=${size} ${size}w`)}
			type="image/jpeg"
		/>
	{:else}
		{#each srcSets as { format, srcset }}
			<source {sizes} {srcset} type="image/{format}" />
		{/each}
	{/if}
	<img
		class="object-cover object-center w-full h-full m-auto"
		src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAFCAYAAAB8ZH1oAAAAFElEQVR42mPkzP/1n4EIwDgEFAIAueEMO8sSG8UAAAAASUVORK5CYII="
		data-src={src}
		{alt}
		height="100%"
		width="100%"
		loading="lazy"
		decoding="async"
		bind:this={imgEl}
	/>
</picture>
