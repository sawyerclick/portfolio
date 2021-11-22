<script>
	import { onMount, getContext } from 'svelte';
	import { scaleOrdinal, scalePow } from 'd3-scale';
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
	import Person from './Dot.svelte';

	let width = 0;
	let height = 0;
	let mounted = false;

	const graphics = getContext('graphics');
	graphics.forEach((d) => (d.r = Math.floor(randomUniform(40, 70)())));

	const dots = [...graphics, { r: 200, publication: 'myself', img: 'me.jpeg' }];

	const uniquePublications = [...new Set(dots.map((d) => d.publication))];

	onMount(() => (mounted = true));

	$: renderedDots = [];

	// define color scale
	$: colorScale = scaleOrdinal()
		.domain(uniquePublications)
		.range(['indianred', 'dodgerblue', 'pink', 'thistle']);

	// gravity strength scale
	$: gravityStrengthScale = scalePow().exponent(2).range([0, 1]).domain([0, 250]);

	// forces
	$: centerPosition = [width / 2, height / 2];
	$: activeForceX = forceX(centerPosition[0]).strength((d) => gravityStrengthScale(d.r));
	$: activeForceY = forceY(centerPosition[1]).strength((d) => gravityStrengthScale(d.r));
	$: activeForceCenter = forceCenter(...centerPosition);
	$: activeForceCollide = forceCollide().radius((d) => d.r + 10);
	$: activeForceManyBody = forceManyBody().strength(-100);
	$: activeForceBoundary = forceBoundary(0, 0, width, height).strength(0.8);

	// an array of forces to pass
	$: forces = [
		['center', activeForceCenter],
		['x', activeForceX],
		['y', activeForceY],
		['charge', activeForceManyBody],
		['boundary', activeForceBoundary],
		['collide', activeForceCollide]
	];

	// impact dots
	let usedForceNames = [];
	$: simulation = forceSimulation()
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

<!-- <svelte:window on:mousemove={mousemove} /> -->

<div class="wrapper z-0 opacity-40 flex flex-col w-full h-full">
	<div class="flex-1 overflow-hidden" bind:clientWidth={width} bind:clientHeight={height}>
		<Canvas {width} {height}>
			{#if mounted}r
				{#each renderedDots as { x, y, r, publication, img }}
					<Person {x} {y} {r} {img} color={colorScale(publication)} delay={0} />
				{/each}
			{/if}
		</Canvas>
	</div>
</div>
