<script>
	import { LayerCake, Svg, Html } from 'layercake';
	import { scaleOrdinal, scaleBand } from 'd3-scale';
	import ForceLayout from './ForceLayout.svelte';
	import { randomInt } from 'd3-random';
	import slugify from 'slugify';
	import graphics from '../../data/graphics.json';

	const categories = ['a', 'b', 'c'];

	let data = [];

	graphics.map((d) => {
		data.push({
			id: slugify(d.title),
			img: d.img,
			category: categories[randomInt(0, 3)()],
			value: randomInt(0, 100)(),
		});
	});

	// const interval = setInterval(() => {
	// 	newPoint();
	// 	console.log(data);
	// 	if (data.length > 10) clearInterval(interval);
	// }, 1000);

	const xKey = 'category';
	const rKey = 'value';
	const zKey = 'category';
	const seriesColors = ['var(--peach)', 'var(--blue)', 'var(--pink)'];
</script>

<div class="chart-container">
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
					>
						<image
							width="1"
							height="1"
							xmlns:xlink
							href="assets/images/portfolio/{point.img}"
						/>
					</pattern>
				{/each}
			</defs>
			<ForceLayout {data} nodeStrokeColor="#000" />
		</Svg>
	</LayerCake>
</div>

<style>
	.chart-container {
		width: 100%;
		height: 100%;
	}

	:global(svg) {
		overflow: visible;
	}
	pattern {
		overflow: hidden;
	}
</style>
