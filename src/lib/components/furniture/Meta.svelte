<script>
	import { page } from '$app/stores';
	import { serializeSchema } from '$lib/utils';
	import site from '$lib/data/site';
	export let meta = false;

	// Page URL
	$: url = $page.url.toString();
</script>

<svelte:head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta http-equiv="Content-Language" content="en" />
	<meta name="robots" content="index,follow" />

	<title>{meta?.title || site.title}</title>
	<meta name="title" content={site.title} />
	<meta name="description" content={meta?.description || site.description} />
	<meta name="author" content={site.title} />
	<meta name="keywords" content={site.keywords.join(',')} />

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="article" />
	<meta property="og:url" content={url} />
	<meta property="og:title" content={meta?.title || site.title} />
	<meta property="og:description" content={meta?.description || site.description} />
	<meta itemprop="image" content={meta?.img?.src || site.img.src} />
	<meta property="og:image:alt" content={meta?.img?.alt || site.img.alt} />

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:creator" content="@sawyerdabear" />
	<meta property="twitter:url" content={url} />
	<meta name="twitter:title" content={meta?.title || site.title} />
	<meta name="twitter:description" content={meta?.description || site.description} />
	<meta name="twitter:image" content={meta?.img?.src || site.img.src} />
	<meta property="twitter:image:alt" content={meta?.img?.alt || site.img.alt} />

	<!-- Favicon -->
	<meta content="apple-touch-icon.png" />
	<link rel="icon" href="favicon.ico" />
	<link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png" />
	<link rel="icon" type="image/png" sizes="32x32" href="favicon-32x32.png" />
	<link rel="icon" type="image/png" sizes="16x16" href="favicon-16x16.png" />
	<link rel="manifest" href="site.webmanifest" />

	<link rel="manifest" href="manifest.json" />
	<link itemprop="url" rel="canonical" href={url} />
	<link rel="alternate" href={url} hreflang="x-default" />

	<meta name="application-name" content={site.title} />
	<meta name="msapplication-starturl" content={url} />
	<meta name="theme-color" content="#ff00ff" />

	<meta name="mobile-web-app-capable" content="yes" />
	<meta name="application-name" content={site.title} />
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
	<meta name="apple-mobile-web-app-title" content={site.title} />

	<!-- JSON+LD -->
	{@html serializeSchema({
		'@context': 'https://schema.org/',
		'@type': 'Person',
		'@id': `${$page.url.origin}/about`,
		url: $page.url,
		name: site.title,
		description: site.description,
		image: $page.url.origin + site.img.src,
		email: site.email,
		alumniOf: 'Columbia University',
		jobTitle: site.job.title,
		worksFor: {
			'@type': 'Organization',
			name: site.job.company
		},
		address: {
			'@type': 'PostalAddress',
			addressRegion: 'TX',
			addressCountry: 'United States'
		},
		sameAs: [site.socials.github.url, site.socials.twitter.url, site.socials.linkedIn.url]
	})}
</svelte:head>
