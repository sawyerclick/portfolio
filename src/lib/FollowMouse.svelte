<script>
	import { onMount } from 'svelte';
	import gsap from 'gsap';

	let innerWidth = 0,
		innerHeight = 0,
		scrollY = 0,
		startingGSAP,
		circles = [
			{
				color: 'bg-red-500',
				duration: 0.8,
				rotation: 90,
				triangleCursor: { xPercent: -25, yPercent: -50 },
				startCoords: () => ({
					x: innerWidth + size,
					y: -size,
					xPercent: 25,
					yPercent: -25
				})
			},
			{
				color: 'bg-green-500',
				duration: 0.6,
				rotation: 180,
				triangleCursor: { xPercent: -75, yPercent: -50 },
				startCoords: () => ({ x: -size, y: -size, xPercent: -25, yPercent: -25 })
			},
			{
				color: 'bg-blue',
				duration: 0.4,
				rotation: 270,
				triangleCursor: { xPercent: -50, yPercent: -25 },
				startCoords: () => ({
					x: innerWidth / 2 - size / 2,
					y: innerHeight + size / 2,
					xPercent: 0,
					yPercent: 25
				})
			}
		];

	const setCircles = () => {
		startingGSAP = circles.forEach(({ node, startCoords, rotation }) => {
			gsap.fromTo(
				node,
				3,
				{ ...startCoords(), ...circDimensions, ...rotation },
				{
					x: innerWidth / 2 - size / 2,
					y: innerHeight / 2 - size / 2
				}
			);
		});
	};

	const mousemove = (e) => {
		if (startingGSAP) startingGSAP.kill();
		circles.forEach(({ node, duration, triangleCursor }) => {
			gsap.to(node, duration, {
				...triangleCursor,
				...circDimensions,
				x: e.clientX,
				y: e.clientY,
				ease: 'none'
			});
		});
	};

	const scroll = () => {
		gsap.to(
			circles.map(({ node }) => node),
			circDimensions,
			0
		);
	};

	onMount(() => {
		setCircles();
	});

	$: size = scrollY < 25 ? 380 : 50;
	$: circDimensions = { width: size, height: size };
</script>

<svelte:window
	on:mousemove={mousemove}
	on:resize={setCircles}
	on:scroll={scroll}
	bind:innerWidth
	bind:innerHeight
	bind:scrollY
/>

{#each circles as { color, node }}
	<span class={color} bind:this={node} style="width:{size}px;height={size}px;" />
{/each}

<style>
	span {
		@apply z-50 mix-blend-color-burn fixed top-0 left-0 rounded-full opacity-75 select-none pointer-events-none;
	}
</style>
