const files = import.meta.glob('./*.yaml', {
	eager: true,
	import: 'default'
});

export const all = Object.fromEntries(
	Object.entries(files).map(([key, value]) => {
		return [key.replace('./', ''), value];
	})
);

export const recent = Object.entries(files).filter(
	([key, d]) => !d.pinned && d.type === 'graphics' && d.show && d.img
);
export const pinned = Object.entries(files).filter(([key, d]) => d?.pinned);

export default all;
