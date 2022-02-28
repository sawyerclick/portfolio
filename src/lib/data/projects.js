import data from '$lib/data/projects.csv';
import slugify from 'slugify';

data.forEach((d) => {
	d.slug = slugify(d.title, { lowercase: true });
});

const pinned = data.filter(({ pinned }) => pinned === 'TRUE');

const recent = data.filter(
	({ lead, img, type, pinned }) =>
		pinned === 'FALSE' && type === 'graphics' && lead === 'TRUE' && img
);

export default { pinned, recent };
