<script>
	import { LayerCake, Svg } from 'layercake';
	import { scaleOrdinal, scaleBand } from 'd3-scale';
	import ForceLayout from './ForceLayout.svelte';
	import { randomInt } from 'd3-random';
	export let graphics;

	const categories = ['a', 'b', 'c'];

	let data = [];

	graphics.map((d) => {
		data.push({
			id: d.id,
			img: d.img,
			category: categories[randomInt(0, 3)()],
			value: randomInt(0, 100)()
		});
	});

	const xKey = 'category';
	const rKey = 'value';
	const zKey = 'category';
	const seriesColors = ['var(--peach)', 'var(--blue)', 'var(--pink)'];
</script>

<div class="w-full h-full">
	<LayerCake
		{data}
		x={xKey}
		r={rKey}
		z={zKey}
		xScale={scaleBand()}
		xDomain={categories}
		rRange={[25, 150]}
		zScale={scaleOrdinal()}
		zDomain={categories}
		zRange={seriesColors}
		ssr={true}
	>
		<Svg>
			<defs>
				{#each graphics as point}
					<pattern
						id={point.id}
						height="100%"
						width="100%"
						patternContentUnits="objectBoundingBox"
						class="overflow-hidden"
					>
						<image width="1" height="1" xmlns:xlink href="assets/images/portfolio/{point.img}" />
					</pattern>
				{/each}
			</defs>
			<ForceLayout {data} nodeStrokeColor="#000" />
		</Svg>
	</LayerCake>
</div>

<style>
	:global(svg) {
		overflow: visible;
	}
</style>
