<script>
	import '$styles/app.postcss';
	import '$styles/font.css';
	import Nav from '$lib/Nav.svelte';
</script>

<Nav />

<slot />

<footer class="text-center my-2 mx-auto">
	<p class="font-serif">
		Made with 🖤 by <a href="https://www.twitter.com/sawyerdabear">Sawyer Click</a> in Dripping Springs,
		Texas
	</p>
</footer>
