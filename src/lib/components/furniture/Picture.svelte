<script>
	import { Image } from 'svelte-lazy-loader';

	export let alt = 'hello world';
	export let slug = 'cloudkitchens-map';

	const placeholder = `/images/portfolio/resized/${slug}/blurred.jpeg`;

	const src = `/images/portfolio/resized/${slug}/400.jpeg`;

	// srcset generator
	const imgSizes = [200, 400, 600, 800];
	const srcset = imgSizes
		.map((size) => `/images/portfolio/resized/${slug}/${size}.jpeg ${size}w`)
		.join(', ');
</script>

<Image
	{placeholder}
	{src}
	{srcset}
	{alt}
	loading="lazy"
	decoding="async"
	draggable="false"
	classes="object-cover object-center w-full h-full m-auto"
/>
