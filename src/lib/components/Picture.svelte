<script>
	import { onMount } from 'svelte';
	import { lazyloader } from '$lib/stores';

	export let alt = 'hello world';
	export let slug = 'cloudkitchens-map';

	let imgEl; // img node
	let loadingExists; // check if native lazy load exists

	const src = `/images/portfolio/resized/${slug}/blurred.jpeg`;

	// srcset generator
	const imgSizes = [200, 400, 600, 800];
	const formats = ['webp', 'png'];
	const sizes = '(min-width: 1280px) 600px';
	const srcsets = formats.map((format) => ({
		format,
		srcset: imgSizes.map((size) => `/images/portfolio/resized/${slug}/${size}.${format} ${size}w`).join(', ')
	}));

	// blurs up image after it's lazy loaded
	const imgBlurUp = (e) => {
		if (e.currentTarget.srcset) e.currentTarget.classList.remove('img-blur-up');
	};

	onMount(() => {
		loadingExists = 'loading' in HTMLImageElement.prototype;
		if (loadingExists) {
			imgEl.src = imgEl.dataset.src;
			imgEl.srcset = imgEl.dataset.srcset;
		}
	});

	// start observing when node is available
	$: if (imgEl && !loadingExists) $lazyloader.observe(imgEl);
</script>

<picture class="object-contain object-center w-full m-auto">
	{#each srcsets as { format, srcset }}
		<source {sizes} {srcset} type="image/{format}" />
	{/each}

	<img
		class="object-cover object-center w-full h-full m-auto img-blur-up"
		src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAFCAYAAAB8ZH1oAAAAFElEQVR42mPkzP/1n4EIwDgEFAIAueEMO8sSG8UAAAAASUVORK5CYII="
		data-src={src}
		srcset=""
		data-srcset={srcsets[1].srcset}
		{alt}
		height="100%"
		width="100%"
		loading="lazy"
		decoding="async"
		bind:this={imgEl}
		on:load={imgBlurUp}
	/>
</picture>

<style>
	.img-blur-up {
		filter: blur(8px);
	}
</style>
