<script>
	import { forceX, forceY, forceCollide, forceCenter, forceManyBody } from 'd3-force';
	import { randomUniform } from 'd3-random';
	import Force from './Force.svelte';

	export let graphics = [];
	graphics.forEach((d) => (d.r = Math.floor(randomUniform(40, 100)())));

	let innerHeight, innerWidth;

	$: counter = 0;
	const interval = setInterval(() => {
		counter++;
		if (counter >= graphics.length) clearInterval(interval);
	}, 1000);

	$: centerPosition = [innerWidth / 2, innerHeight / 2];

	$: activeForceX = forceX().x(centerPosition[0]).strength(0.01);
	$: activeForceY = forceY().y(centerPosition[1]).strength(0.01);
	$: activeForceCenter = forceCenter(...centerPosition);
	$: activeForceCollide = forceCollide()
		.radius((d) => d.r + 5)
		.iterations(1);
	$: activeForceManyBody = forceManyBody().strength(-200);
	$: forces = [
		['x', activeForceX],
		['y', activeForceY],
		['charge', activeForceManyBody],
		['center', activeForceCenter],
		['collide', activeForceCollide]
	];
</script>

<svelte:window bind:innerHeight bind:innerWidth />

<div class="w-full h-screen">
	<Force {forces} dots={graphics} height={innerHeight} {graphics} />
</div>
