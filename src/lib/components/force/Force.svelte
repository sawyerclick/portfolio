<script>
	import { forceSimulation } from 'd3-force';
	import { move } from '$lib/utils';

	// an array of [name, force] pairs
	export let width, height;
	export let forces = [];
	export let graphics = [];
	export let dots = [];

	let usedForceNames = [];
	let renderedDots = [];

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
		simulation.alpha(1).velocityDecay(0.9);
		simulation.restart();
	}
</script>

<figure class="c">
	<svg {width} {height}>
		<defs>
			{#each graphics as { img }, i}
				<pattern id="img-{i}" height="100%" width="100%" patternContentUnits="objectBoundingBox">
					<image
						preserveAspectRatio="xMidYMid slice"
						width="1"
						height="1"
						xmlns:xlink
						href={img.includes('https://')
							? img + '&width=200&'
							: `/images/portfolio/resized/${img.split('.')[0]}/200.png`}
					/>
				</pattern>
			{/each}
		</defs>

		{#each renderedDots as { x, y, r }, i}
			<g style={move(x, y)}>
				<circle {r} fill="url(#img-{i})" />
			</g>
		{/each}
	</svg>
</figure>

<style>
	figure {
		margin: 0;
	}
	svg {
		overflow: visible;
	}
	circle,
	rect {
		stroke: black;
		stroke-opacity: 0.4;
		cursor: crosshair;
		opacity: 0.2;
	}
	pattern {
		overflow: hidden;
	}
</style>
