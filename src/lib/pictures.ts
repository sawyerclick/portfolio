const pictures = import.meta.glob('./assets/**/*.{avif,gif,heif,jpeg,jpg,png,tiff,webp}', {
	query: { enhanced: true },
	eager: true,
	import: 'default'
});

export default Object.fromEntries(
	Object.entries(pictures).map(([key, value]) => {
		return [key.replace('./assets/', ''), value];
	})
);
