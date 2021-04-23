<script>
	import { onMount } from 'svelte';
	import Meta from './Meta.svelte';
	import Page from './Page.svelte';
	import meta from '../meta.json';

	let vh;
	onMount(() => {
		// create true vh
		document.documentElement.style.setProperty('--vh', `${vh / 100}px`);
	});
</script>

<!-- meta and window -->
<!-- <Meta {meta} /> -->
<svelte:window bind:innerHeight={vh} />

<!-- actual content -->
<Page />
