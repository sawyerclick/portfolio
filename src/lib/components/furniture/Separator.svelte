<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { theme } from '$lib/stores';

	interface $$Props extends HTMLAttributes<HTMLHRElement> {}

	$: light = $theme !== 'light';
</script>

<hr {...$$restProps} class:x-light={light} class:x-dark={!light} />

<style>
	hr {
		display: block;
		background-repeat: repeat-x;
		background-size: contain;
		width: 100%;
		height: 5px;
	}
	hr.x-light {
		background-image: url('/images/x-light.png');
	}
	hr.x-dark {
		background-image: url('/images/x-dark.png');
	}
</style>
