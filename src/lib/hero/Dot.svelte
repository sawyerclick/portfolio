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

	let imgEl;
	let innerHeight;
	let innerWidth;

	const image = new Image(r, r);
	const imgSrc =
		img === 'me.jpeg'
			? `/images/${img}`
			: img.includes('https://')
			? img + '?width=200&format=jpeg?auto=webp'
			: `/images/portfolio/resized/${img.split('.')[0]}/200.png`;

	image.src = imgSrc;

	function scaleToFill(img) {
		// get the scale
		var scale = Math.max(canvas.width / img.width, canvas.height / img.height);
		// get the top left position of the image
		var x = canvas.width / 2 - (img.width / 2) * scale;
		var y = canvas.height / 2 - (img.height / 2) * scale;
		ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
	}

	const { register, deregister, invalidate } = getContext(contextName);

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

		ctx.drawImage(image, -r, -r, image.width * 2, image.height * 2);
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

<img
	bind:this={imgEl}
	class="hidden object-center object-contain"
	src={imgSrc}
	alt="This is hidden, how did you see it!"
	height="100px"
	width="100px"
/>
