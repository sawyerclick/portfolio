/**
 * A standard markdown parser with a custom config
 * @see https://github.com/markdown-it/markdown-it
 */

import MarkdownIt from 'markdown-it';
import MarkdownItAttrs from 'markdown-it-attrs';
// @ts-ignore
import MarkdownItBracketedSpans from 'markdown-it-bracketed-spans';
import MarkdownItContainer from 'markdown-it-container';
import MarkdownItAnchor from 'markdown-it-anchor';

const md = new MarkdownIt({
	html: true,
	breaks: true,
	linkify: true,
	typographer: true
}).disable(['backticks']);

/**
 * @description Render all links with target=_blank and rel="noreferrer noopener"
 * @see https://github.com/markdown-it/markdown-it/blob/master/docs/architecture.md#renderer
 */
// Remember old renderer, if overridden, or proxy to default renderer
const defaultRender =
	md.renderer.rules.link_open ||
	function (tokens, idx, options, env, self) {
		return self.renderToken(tokens, idx, options);
	};

// @ts-ignore
md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
	// If you are sure other plugins can't add `target` - drop check below
	const targetIndex = tokens[idx].attrIndex('target');

	if (targetIndex < 0) tokens[idx].attrPush(['target', '_blank']); // add new attribute
	else tokens[idx].attrs[targetIndex][1] = '_blank'; // replace value of existing attr

	// If you are sure other plugins can't add `rel` - drop check below
	const relIndex = tokens[idx].attrIndex('rel');

	if (relIndex < 0) tokens[idx].attrPush(['rel', 'noreferrer noopener']); // add new attribute
	else tokens[idx].attrs[relIndex][1] = 'noreferrer noopener'; // replace value of existing attr

	// pass token to default renderer.
	return defaultRender(tokens, idx, options, env, self);
};

md.use(MarkdownItBracketedSpans)
	.use(MarkdownItAttrs)
	.use(MarkdownItContainer)
	.use(MarkdownItAnchor);

/**
 * @description Parse and render markdown to html. Add two empty lines between grafs to separate tags.
 * @param {string} string - The markdown string to parse
 * @param {object} attrs - attributes to add to the div
 * @param {string} attrs.class - classes to add to the div
 * @returns {string} - The parsed html
 */
export default (string, attrs) => {
	const { class: classes = '', ...rest } = attrs;
	const attrString = Object.entries(rest)
		.map(([key, value]) => `${key}="${value}"`)
		.join(' ');
	return `<div class="markdown ${classes}" ${attrString}>${md.render(string)}</div>`;
};
