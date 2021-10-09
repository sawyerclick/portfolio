<script>
	export let meta;
</script>

<svelte:head>
	<title>{meta.title}</title>

	<meta
		name="description"
		content="Hi! I'm Sawyer. I'm a newsroom technologist working on visual journalism."
	/>
	<meta property="og:type" content="article" />
	<meta property="og:url" content="https://www.sawyer.codes" />
	<meta
		property="og:description"
		content="Hi! I'm Sawyer. I'm a newsroom technologist working on visual journalism."
	/>
	<meta property="og:title" content="Sawyer Click, newsroom technologist" />
	<!-- <meta property="og:image" content="{meta.Image}" />

<meta name="twitter:image" content="{meta.Image}" /> -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content="https://www.sawyer.codes" />
	<meta name="twitter:title" content="Sawyer Click, newsroom technologist" />
	<meta
		name="twitter:description"
		content="Hi! I'm Sawyer. I'm a newsroom technologist working on visual journalism."
	/>
</svelte:head>
