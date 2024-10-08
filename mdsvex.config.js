import { h } from 'hastscript';
import autoLinkHeadings from 'rehype-autolink-headings';
import slug from 'rehype-slug';
import urls from 'rehype-urls';
import { visit } from 'unist-util-visit';

/**
 * Modified from https://github.com/josestg/rehype-figure
 */
function figure() {
	function buildFigure({ properties }) {
		const figure = h('figure', null, [
			h('img', { ...properties }),
			properties.title ? h('figcaption', properties.title) : ''
		]);
		return figure;
	}

	return function (tree) {
		visit(tree, { tagName: 'p' }, (node, index) => {
			const images = node.children
				.filter((n) => n.tagName === 'img')
				.map((img) => buildFigure(img));

			if (images.length === 0) return;

			tree.children[index] =
				images.length === 1 ? images[0] : (tree.children[index] = h('div', null, images));
		});
	};
}

function processUrl(url, node) {
	if (node.tagName === 'a') {
		if (!(url.href.startsWith('/') || url.href.startsWith('#'))) {
			// Open external links in new tab
			node.properties.target = '_blank';
			// Fix a security concern with offsite links
			// See: https://web.dev/external-anchors-use-rel-noopener/
			node.properties.rel = 'noopener';
		}
	}
}

const config = {
	extensions: ['.svelte.md'],
	layout: {
		post: './src/routes/blog/_layout.svelte'
	},
	smartypants: true,
	rehypePlugins: [
		figure, // convert images into <figure> elements
		[urls, processUrl], // adds rel and target to <a> elements
		slug, // adds slug to <h1>-<h6> elements
		[autoLinkHeadings, { behavior: 'wrap' }] // adds a <a> around slugged <h1>-<h6> elements
		// [
		// 	addClasses,
		// 	{
		// 		h1: 'font-semibold',
		// 		h2: 'text-3xl',
		// 		'h2,h3,h4,h5,h6': 'font-sans font-bold tracking-wider leading-none mt-8 mb-4 pt-6',
		// 		'ul,ol': 'list-chevron marker:text-secondary',
		// 		li: '',
		// 		p: 'body'
		// 	}
		// ] // add classes to these elements
	]
};

export default config;
