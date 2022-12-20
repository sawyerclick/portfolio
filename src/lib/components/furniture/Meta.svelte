<script>
	import { page } from '$app/stores';
	import serializeSchema from '$lib/utils/serializeSchema';

	$: ({ tag, title, description, author, keywords, image, colors, socials, job } = $page.data);

	// Page URL
	$: url = $page.url.toString();
</script>

<svelte:head>
	<meta charset="utf-8" />
	<meta
		name="viewport"
		content="width=device-width, initial-scale=0.86, maximum-scale=5.0, minimum-scale=0.86"
	/>

	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta http-equiv="Content-Language" content="en" />
	<meta name="robots" content="index,follow" />

	<title>{title}</title>
	<meta name="title" content={title} />
	<meta name="description" content={description} />
	<meta name="author" content={author} />
	<meta name="keywords" content={keywords.join(',')} />

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content={url} />
	{#if $page.pathname !== '/'}
		<meta property="og:site_name" content={tag} />
	{/if}
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:locale" content="en-US" />
	<meta itemprop="image" property="og:image" content={image.large.src} />
	<meta property="og:image:height" content={image.large.height} />
	<meta property="og:image:width" content={image.large.width} />
	<meta property="og:image:alt" content={image.alt} />

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content={socials.twitter.username} />
	<meta name="twitter:creator" content={socials.twitter.username} />
	<meta name="twitter:url" content={url} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={image.small.src} />
	<meta name="twitter:image:alt" content={image.alt} />

	<!-- Favicons in app.html -->
	<!-- https://evilmartians.com/chronicles/how-to-favicon-in-2021-six-files-that-fit-most-needs -->

	<!-- pwa -->
	<link itemprop="url" rel="canonical" href={url} />
	<link rel="alternate" href={url} hreflang="x-default" />
	<meta name="msapplication-starturl" content={url} />
	<meta name="theme-color" content={colors.theme} />
	<meta name="application-name" content={title} />
	<meta name="mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
	<meta name="apple-mobile-web-app-title" content={title} />

	<!-- JSON+LD -->
	{@html serializeSchema({
		'@context': 'https://schema.org/',
		'@type': 'Person',
		'@id': `${$page.url.origin}/whoami`,
		url: url,
		name: title,
		description: description,
		image: $page.url.origin + image.large.src,
		email: socials.email.username,
		alumniOf: 'Columbia University',
		jobTitle: job.title,
		worksFor: {
			'@type': 'Organization',
			name: job.company
		},
		address: {
			'@type': 'PostalAddress',
			addressRegion: 'TX',
			addressCountry: 'United States'
		},
		sameAs: [socials.github.url, socials.twitter.url, socials.linkedIn.url]
	})}
</svelte:head>
