<script>
	import Icon from './helpers/Icon.svelte';
	import Chart from './chart/Chart.svelte';
	import Icons from './Icons.svelte';
</script>

<div id="landing">
	<div class="chart">
		<Chart />
	</div>

	<div class="header">
		<h1>Sawyer Click</h1>
		<h2 class="sans light">
			develops interactive graphics at <a
				href="https://www.businessinsider.com/category/sawyer-click"
				target="_blank">Business Insider</a
			>
		</h2>
		<div class="icons">
			<Icons />
		</div>
	</div>

	<div class="arrow-down">
		<Icon name="chevron-down" width="3rem" height="3rem" />
	</div>
</div>

<style lang="scss">
	.chart {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 100vh;
		width: 100vw;
		z-index: -1;
		overflow-y: hidden;
		&::before {
			content: '';
			z-index: 1;
			position: absolute;
			bottom: 0px;
			left: 0;
			right: 0;
			height: 20px;
			background: rgb(248, 248, 248);
			background: linear-gradient(
				0deg,
				rgba(248, 248, 248, 1) 20%,
				rgba(248, 248, 248, 0) 100%
			);
		}
	}
	#landing {
		height: 100vh;
		height: calc(var(--vh, 1vh) * 100);
		display: flex;
		justify-content: flex-start;
		align-items: flex-end;
		overflow-x: hidden;

		.header {
			margin: 2rem 0.5rem 4rem 2rem;
			@media screen and (max-width: 700px) {
				margin-left: 1rem;
			}
			h1 {
				font-size: 7rem;
				line-height: 1.1;
				margin: 0;
				text-shadow: -1px -1px var(--gray), 1px 1px var(--gray),
					1px -1px var(--gray), -1px 1px var(--gray);
				@media screen and (max-width: 700px) {
					font-size: 5rem;
				}
			}
			h2 {
				max-width: 100%;
				font-size: 2rem;
				font-weight: 500;
				line-height: 1.1;
				margin: 0;
				text-shadow: -1px -1px var(--gray), 1px 1px var(--gray),
					1px -1px var(--gray), -1px 1px var(--gray);
			}
			.icons {
				margin: 1.25rem 0 0;
			}
		}
		.arrow-down {
			position: absolute;
			bottom: 0.5rem;
			right: 1rem;
		}
	}
</style>
