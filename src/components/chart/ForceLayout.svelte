<script>
	// Uses a d3-force technique from @plmrry
	import { getContext } from 'svelte';
	import {
		forceSimulation,
		forceManyBody,
		forceCollide,
		forceCenter,
	} from 'd3-force';
	const { data, width, height, rGet, zGet } = getContext('LayerCake');

	export let manyBodyStrength = 0;
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

		console.log(nodes);
	}
</script>

{#each nodes as point}
	<!-- fill={nodeColor || $zGet(point)} -->
	<g>
		<circle
			class="node"
			r={$rGet(point)}
			fill={'url(#' + point.id + ')'}
			stroke-width={nodeStrokeWidth}
			stroke={nodeStrokeColor}
			cx={point.x}
			cy={point.y}
			style="opacity: .06;"
		/>
	</g>
{/each}
