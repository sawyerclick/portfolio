const files = import.meta.glob('./*.{yaml}', {
	eager: true,
	import: 'default'
});

export const all = Object.fromEntries(
	Object.entries(files).map(([key, value]) => {
		return [key.replace('./', ''), value];
	})
);

export default all;
