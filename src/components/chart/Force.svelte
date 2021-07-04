<script>
	import { forceSimulation } from 'd3-force';

	// utility function for translating elements
	const move = (mx, my) => `transform: translate(${mx}px, ${my}px`;

	// an array of our particles
	export let dots = [];
	// an array of [name, force] pairs
	export let forces = [];
	export let height, r, colors, graphics;

	let width;
	let usedForceNames = [];
	let renderedDots = [];

	$: simulation = forceSimulation()
		.nodes(dots)
		.on('tick', () => {
			// update the renderedDots reference to trigger an update
			renderedDots = [...dots];
		});

	$: {
		// re-initialize forces when they change
		forces.forEach(([name, force]) => {
			simulation.force(name, force);
		});

		// remove old forces
		const newForceNames = forces.map(([name]) => name);
		let oldForceNames = usedForceNames.filter(
			(force) => !newForceNames.includes(force)
		);
		oldForceNames.forEach((name) => {
			simulation.force(name, null);
		});
		usedForceNames = newForceNames;

		// kick our simulation into high gear
		simulation.alpha(1).velocityDecay(0.9);
		simulation.restart();
	}
</script>

<figure class="c" bind:clientWidth={width}>
	<svg {width} {height}>
		<defs>
			{#each graphics as point, i}
				<pattern
					id="img-{i}"
					height="100%"
					width="100%"
					patternContentUnits="objectBoundingBox"
				>
					<image
						preserveAspectRatio="xMidYMid slice"
						width="1"
						height="1"
						xmlns:xlink
						href="assets/images/portfolio/{point.img}"
					/>
				</pattern>
			{/each}
		</defs>

		{#each renderedDots as dot, i}
			<g style={move(dot.x, dot.y)}>
				<circle r={r[i]} fill="url(#img-{i})" />
			</g>
		{/each}
	</svg>
</figure>

<style lang="scss">
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
		// stroke-dasharray: 3, ;
		cursor: crosshair;
		opacity: 0.2;
	}
	pattern {
		overflow: hidden;
		image {
		}
	}
</style>
