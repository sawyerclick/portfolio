<script>
	import { getContext, onMount, onDestroy, afterUpdate } from 'svelte';
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';

	export let x = 0;
	export let y = 0;
	export let r = 4;
	export let img = 'images/me.jpeg';
	export let color = '#000000';
	export let delay = 0;
	export let contextName = 'canvas';

	const { register, deregister, invalidate } = getContext(contextName);

	const diameter = r * 2;

	let innerHeight;
	let innerWidth;

	const image = new Image(diameter, diameter);
	image.src =
		img === 'me.jpeg'
			? `/images/${img}`
			: img.includes('https://')
			? img + '?width=200&format=jpeg?auto=webp'
			: `/images/portfolio/resized/${img.split('.')[0]}/200.png`;

	const tX = tweened(null, tweenParameters);
	const tY = tweened(null, tweenParameters);

	const draw = (ctx) => {
		ctx.translate($tX, $tY);

		ctx.fillStyle = 'transparent';
		ctx.strokeStyle = '#666'; // by scale ord use color
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

		return () => {
			deregister(draw);
		};
	});

	afterUpdate(invalidate);

	onDestroy(invalidate);

	$: tweenParameters = {
		duration: 400,
		easing: cubicOut,
		delay
	};

	$: tX.set(x, tweenParameters);
	$: tY.set(y, tweenParameters);
</script>

<svelte:window bind:innerHeight bind:innerWidth />
