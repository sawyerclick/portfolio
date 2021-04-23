<script>
	import { LayerCake, Svg, Html } from 'layercake';
	import { scaleOrdinal, scaleBand } from 'd3-scale';
	import ForceLayout from './ForceLayout.svelte';
	import { randomInt } from 'd3-random';

	const categories = ['a', 'b', 'c'];

	let data = [];
	for (var i = 0; i < 250; i++) {
		data.push({
			category: categories[randomInt(0, 3)()],
			value: randomInt(0, 100)(),
		});
	}

	const xKey = 'category';
	const rKey = 'value';
	const zKey = 'category';

	const seriesColors = ['var(--peach)', 'var(--blue)', 'var(--pink)'];

	let manyBodyStrength = -2;
	let xStrength = 0;
</script>

<div class="chart-container">
	<LayerCake
		{data}
		x={xKey}
		r={rKey}
		z={zKey}
		xScale={scaleBand()}
		xDomain={categories}
		rRange={[5, 75]}
		zScale={scaleOrdinal()}
		zDomain={categories}
		zRange={seriesColors}
	>
		<Svg>
			<ForceLayout
				{manyBodyStrength}
				{xStrength}
				nodeStrokeColor="#000"
			/>
		</Svg>
	</LayerCake>
</div>

<style>
	.chart-container {
		width: 100%;
		height: 100%;
	}
</style>
