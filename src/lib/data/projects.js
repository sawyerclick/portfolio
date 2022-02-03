import data from '$lib/data/projects.csv';
import slugify from 'slugify';

const affiliations = new Map([
	['The DataFace', 'tdf'],
	['Business Insider', 'bi'],
	['NBC News', 'nbc'],
	['The Wall Street Journal', 'wsj']
]);

const formatted = data.map((d) => ({
	slug: slugify(d.title, { lowercase: true }),
	affiliation: affiliations.get(d.publication) || 'side-project',
	...d
}));

export default formatted;
