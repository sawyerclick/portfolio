<script>
	export let meta;
</script>

<svelte:head>
	<title>{meta.title}</title>

	<meta http-equiv="refresh" content="0; URL=https://www.sawyer.codes/" />

	<meta name="description" content={meta.description} />
	<meta property="og:type" content="article" />
	<meta property="og:url" content="https://www.sawyer.codes{meta.slug}" />
	<meta property="og:title" content={meta.title} />
	<meta property="og:description" content={meta.description} />

	<!-- <meta property="og:image" content="{meta.Image}" />

<meta name="twitter:image" content="{meta.Image}" /> -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:creator" content="@sawyerdabear" />
	<meta name="twitter:title" content={meta.title} />
	<meta name="twitter:description" content={meta.description} />
</svelte:head>
