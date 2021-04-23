<script>
	import metadata from '../data/meta.json';
</script>

<svelte:head>
	<title>{metadata.siteName}</title>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
	<meta name="description" content={metadata.description} />
	<meta name="news_keywords" content={metadata.keywords} />

	<meta property="og:title" content={metadata.title} />
	<meta property="og:site_name" content={metadata.siteName} />
	<meta property="og:url" content={metadata.url} />
	<meta property="og:description" content={metadata.description} />
	<meta property="og:type" content="article" />
	<meta property="og:locale" content="en_US" />

	<meta property="og:image" content={metadata.imgFacebook} />
	<meta property="og:image:type" content="image/jpeg" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="600" />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content={metadata.site} />
	<meta name="twitter:creator" content={metadata.author.twitterHandle} />
	<meta name="twitter:title" content={metadata.title} />
	<meta name="twitter:description" content={metadata.description} />
	<meta name="twitter:image:src" content={metadata.imgTwitter} />

	<meta name="apple-touch-fullscreen" content="yes" />
	<meta
		name="viewport"
		content="width=device-width, initial-scale=1.0, maximum-scale=1.0"
	/>
	<meta http-equiv="content-type" content="text/html; charset=utf-8" />

	<!-- Icons and otherwise -->
	<link
		rel="apple-touch-icon"
		sizes="180x180"
		href="../images/site/favicon/apple-touch-icon.png"
	/>
	<link
		rel="icon"
		type="image/png"
		sizes="32x32"
		href="../images/site/favicon/favicon-32x32.png"
	/>
	<link
		rel="icon"
		type="image/png"
		sizes="16x16"
		href="../images/site/favicon/favicon-16x16.png"
	/>
	<link rel="manifest" href="../images/site/favicon/site.webmanifest" />

	<link rel="canonical" href={metadata.url} />
</svelte:head>
