<script>
	import { getContext, onMount, onDestroy, afterUpdate } from 'svelte';
	import { spring } from 'svelte/motion';

	export let x = 0;
	export let y = 0;
	export let r = 4;
	export let img = 'me.jpeg';
	export let contextName = 'canvas';

	export let springParameters = { stiffness: 0.1, damping: 1 };

	const { register, deregister, invalidate } = getContext(contextName);

	const diameter = r * 2;

	let innerHeight;
	let innerWidth;

	const image = new Image(diameter, diameter);
	image.src =
		img === 'me.jpeg' ? `images/me.jpeg` : `/images/thumbnails/${img.split('.')[0]}/300.jpeg`;

	const tX = spring(null, springParameters);
	const tY = spring(null, springParameters);
	

	const draw = (ctx) => {
		ctx.translate($tX, $tY);

		ctx.fillStyle = '#f8f8f8';
		ctx.strokeStyle = '#666';
		ctx.backgroundColor = '#f7f7f7';

		ctx.save();
		ctx.beginPath();
		ctx.arc(0, 0, r, 0, 2 * Math.PI, false);

		ctx.fill();
		ctx.clip();

		ctx.drawImage(image, -r, -r, diameter, diameter);
		ctx.restore();
		ctx.stroke();
	};

	onMount(() => {
		register(draw);
		invalidate();
		return () => deregister(draw);
	});

	afterUpdate(invalidate);
	onDestroy(invalidate);

	$: tX.set(x);
	$: tY.set(y);
</script>

<svelte:window bind:innerHeight bind:innerWidth />
