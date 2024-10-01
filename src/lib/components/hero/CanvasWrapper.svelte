<script>
	import { onMount, getContext } from 'svelte';
	import { scalePow } from 'd3-scale';
	import { randomUniform } from 'd3-random';
	import {
		forceX,
		forceY,
		forceCollide,
		forceCenter,
		forceManyBody,
		forceSimulation
	} from 'd3-force';
	import forceBoundary from 'd3-force-boundary';
	import Canvas from './Canvas.svelte';
	import Dot from './Dot.svelte';

	let width = 0;
	let height = 0;
	let mounted = false;

	const graphics = getContext('graphics');
	graphics.forEach((d) => (d.r = Math.floor(randomUniform(40, 70)())));

	const dots = [...graphics, { r: 200, publication: 'myself', img: 'me.jpeg' }];

	onMount(() => (mounted = true));

	$: renderedDots = [];

	// gravity strength scale
	$: gravityStrengthScale = scalePow().exponent(2).range([0, 1]).domain([0, 250]);

	$: centerPosition = [width / 2, height / 2];

	// an array of forces to pass
	$: forces = [
		['center', forceCenter(...centerPosition)],
		// ['x', forceX(centerPosition[0]).strength((d) => gravityStrengthScale(d.r))],
		// ['y', forceY(centerPosition[1]).strength((d) => gravityStrengthScale(d.r))],
		['charge', forceManyBody().strength(-1)],
		// ['boundary', width > 500 ? forceBoundary(0, 0, width, height).strength(1) : null],
		['collide', forceCollide().radius((d) => d.r + 5)]
	];

	// impact dots
	let usedForceNames = [];
	$: simulation = forceSimulation()
		.alphaTarget(0.3) // stay hot
		.velocityDecay(0.1) // low friction
		.nodes(dots)
		.on('tick', () => (renderedDots = [...dots]));

	$: {
		// re-initialize forces when they change
		forces.forEach(([name, force]) => simulation.force(name, force));

		// remove old forces
		const newForceNames = forces.map(([name]) => name);
		let oldForceNames = usedForceNames.filter((force) => !newForceNames.includes(force));
		oldForceNames.forEach((name) => simulation.force(name, null));
		usedForceNames = newForceNames;

		// kick our simulation into high gear
		simulation.alpha(1).velocityDecay(0.85);
		simulation.restart();
	}
</script>

<div class="wrapper z-0 opacity-40 flex flex-col w-full h-full dark:mix-blend-lighten">
	<figure class="flex-1" bind:clientWidth={width} bind:clientHeight={height}>
		<Canvas {width} {height}>
			{#if mounted}
				{#each renderedDots as { x, y, r, img }}
					<Dot {x} {y} {r} {img} />
				{/each}
			{/if}
		</Canvas>
	</figure>
</div>
