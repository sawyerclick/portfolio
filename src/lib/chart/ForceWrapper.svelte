<script>
	import { forceX, forceY, forceCollide, forceCenter, forceManyBody } from 'd3-force';
	import forceBoundary from 'd3-force-boundary';
	import { randomUniform } from 'd3-random';
	import Force from './Force.svelte';
	import { viewport } from '$stores';

	export let graphics = [];
	graphics.forEach((d) => (d.r = Math.floor(randomUniform(40, 100)())));

	$: counter = 0;
	const interval = setInterval(() => {
		counter++;
		if (counter >= graphics.length) clearInterval(interval);
	}, 1000);

	$: centerPosition = [$viewport.width / 2, $viewport.height / 2];

	$: activeForceX = forceX().x(centerPosition[0]).strength(0.01);
	$: activeForceY = forceY().y(centerPosition[1]).strength(0.01);
	$: activeForceCenter = forceCenter(...centerPosition);
	$: activeForceCollide = forceCollide()
		.radius((d) => d.r + 5)
		.iterations(1);
	$: activeForceManyBody = forceManyBody().strength(-200);
	$: activeForceBoundary = forceBoundary(0, 0, $viewport.width, $viewport.height);
	$: forces = [
		['x', activeForceX],
		['y', activeForceY],
		['charge', activeForceManyBody],
		['center', activeForceCenter],
		// ['boundary', activeForceBoundary],
		['collide', activeForceCollide]
	];
</script>

<div class="w-full h-screen">
	<Force {forces} dots={graphics} height={$viewport.height} {graphics} />
</div>
