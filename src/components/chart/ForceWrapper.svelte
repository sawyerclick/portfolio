<script>
	import { onMount } from 'svelte';
	import {
		forceX,
		forceY,
		forceCollide,
		forceCenter,
		forceManyBody,
	} from 'd3-force';
	// import { randomInt } from 'd3-random';
	import debounce from 'lodash.debounce';
	import Force from './Force.svelte';
	let vh;
	import graphics from '../../data/graphics.json';

	onMount(() => {
		// create true vh
		document.documentElement.style.setProperty('--vh', `${vh / 100}px`);
		window.addEventListener(
			'resize',
			debounce(() => {
				document.documentElement.style.setProperty(
					'--vh',
					`${vh / 100}px`
				);
			}, 50)
		);
	});

	// create data and handle update
	$: data = [];
	let counter = 0;
	const interval = setInterval(() => {
		// can't normally push bc of $:
		data = [
			...data,
			{
				img: graphics[counter].img,
			},
		];
		counter++;
		if (counter >= graphics.length) clearInterval(interval);
	}, 1000);

	let el;
	let width;

	$: numberOfDots = graphics.length;
	$: height = vh;
	$: centerPosition = [width / 2, height / 2];
	let useForceCollide = true; // true = collision detection

	$: activeForceX = forceX().x(centerPosition[0]).strength(0.01);
	$: activeForceY = forceY().y(centerPosition[1]).strength(0.01);
	$: activeForceCenter = forceCenter(centerPosition[0], centerPosition[1]);
	$: activeForceCollide = forceCollide()
		.radius((d, i) => r[i] + 5)
		.iterations(1);
	$: activeForceManyBody = forceManyBody().strength(0);
	$: forces = [
		['x', activeForceX],
		['y', activeForceY],
		['charge', activeForceManyBody],
		['center', activeForceCenter],
		useForceCollide && ['collide', activeForceCollide],
	].filter((d) => d);
	$: r = data.map((d) => 80);
	$: colors = data.map((d) => d.color);
	$: dots = new Array(numberOfDots).fill(0).map((_) => ({}));
</script>

<svelte:window bind:innerHeight={vh} />

<div bind:this={el} bind:clientWidth={width}>
	<Force {forces} {dots} {height} {r} {colors} {graphics} />
</div>

<style lang="scss">
</style>
