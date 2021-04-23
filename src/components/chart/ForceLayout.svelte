<script>
	// Uses a d3-force technique from @plmrry
	import { getContext } from 'svelte';
	import {
		forceSimulation,
		forceX,
		forceManyBody,
		forceCollide,
		forceCenter,
	} from 'd3-force';
	import { randomInt } from 'd3-random';

	const {
		data,
		width,
		height,
		xScale,
		xGet,
		rGet,
		zGet,
		custom,
	} = getContext('LayerCake');

	/* --------------------------------------------
	 * Here are some values to play with, but most every force layout
	 * is going be unique and this component will need to be customized
	 * See more: https://github.com/d3/d3-force/blob/master/README.md
	 */
	export let manyBodyStrength = 0;
	/* --------------------------------------------
	 * Set a manual color, otherwise it will default to using the zScale
	 */
	export let nodeColor = undefined;
	export let nodeStrokeWidth = 1;
	export let nodeStrokeColor = '#fff';

	/* --------------------------------------------
	 * Make a copy because the simulation will alter the objects
	 */
	const initialNodes = $data.map((d) => ({ ...d }));

	const simulation = forceSimulation(initialNodes);

	let nodes = [];

	simulation.on('tick', () => {
		nodes = simulation.nodes();
	});

	/* ----------------------------------------------
	 * When variables change, set forces and restart the simulation
	 */
	$: {
		simulation
			.force('charge', forceManyBody().strength(manyBodyStrength))
			.force(
				'collision',
				forceCollide().radius((d) => {
					return $rGet(d) + nodeStrokeWidth / 2 + 1;
				})
			)
			.force('center', forceCenter($width / 2, $height / 2))
			.alpha(1)
			.restart();
	}
</script>

{#each nodes as point}
	<circle
		class="node"
		r={$rGet(point)}
		fill={nodeColor || $zGet(point)}
		stroke-width={nodeStrokeWidth}
		stroke={nodeStrokeColor}
		cx={point.x}
		cy={point.y}
		style="opacity: .06;"
	/>
{/each}
