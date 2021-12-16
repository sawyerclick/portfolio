<script>
	import '$styles/app.postcss';
	import '$styles/font.css';

	// import FollowMouse from '$lib/FollowMouse.svelte';

	// Whenever the user explicitly chooses light mode
	// localStorage.theme = 'light'
	// Whenever the user explicitly chooses dark mode
	// localStorage.theme = 'dark'
	// Whenever the user explicitly chooses to respect the OS preference
	// localStorage.removeItem('theme');
</script>

<!-- <FollowMouse /> -->

<slot />
