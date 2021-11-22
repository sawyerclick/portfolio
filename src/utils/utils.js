import { linear } from 'svelte/easing';
import { interpolateTransformSvg } from 'd3-interpolate';

const move = (x, y) => `transform: translate(${x}px, ${y}px)`;

const transformSvg = (node, params) => {
	const a = node.getAttribute('transform');
	const b = `${params.relative ? a : ''} ${params.target}`;
	const interpolator = interpolateTransformSvg(a, b);

	return {
		delay: params.delay || 0,
		duration: params.duration || 250,
		easing: params.easing || linear,
		tick: (t, u) => {
			const transform = interpolator(u);
			node.setAttribute('transform', transform);
		},
		css: (t) => (params.opacity ? `opacity: ${t}` : null)
	};
};

// adapted from https://github.com/Wattenberger/svelte-recipes/blob/master/src/components/examples/scale-canvas.js
const scaleCanvas = (canvas, ctx, width, height, center = true) => {
	// assume the device pixel ratio is 1 if the browser doesn't specify it
	const devicePixelRatio = window.devicePixelRatio || 1;

	// determine the 'backing store ratio' of the canvas ctx
	const backingStoreRatio =
		ctx.webkitBackingStorePixelRatio ||
		ctx.mozBackingStorePixelRatio ||
		ctx.msBackingStorePixelRatio ||
		ctx.oBackingStorePixelRatio ||
		ctx.backingStorePixelRatio ||
		1;

	// determine the actual ratio we want to draw at
	const ratio = devicePixelRatio / backingStoreRatio;

	if (devicePixelRatio !== backingStoreRatio) {
		// set the 'real' canvas size to the higher width/height
		canvas.width = width * ratio;
		canvas.height = height * ratio;

		// ...then scale it back down with CSS
		canvas.style.width = width + 'px';
		canvas.style.height = height + 'px';
	} else {
		// this is a normal 1:1 device; just scale it simply
		canvas.width = width;
		canvas.height = height;
		canvas.style.width = '';
		canvas.style.height = '';
	}

	// scale the drawing ctx so everything will work at the higher ratio
	ctx.scale(ratio, ratio);

	if (center) ctx.translate(width / 2, height / 2);
};

const layoutHistogram = (
	data,
	{ r = 1, x = (d) => d, xCategory = 'x', fy = 0, offset = r * 2 + 1 }
) => {
	const scaledData = data.map((d) => ({ ...d, x: +x(d), y: 0 }));

	const histo = scaledData.reduce((acc, cur) => {
		const entry = cur[xCategory].toString();
		if (acc[entry]) {
			return {
				...acc,
				[entry]: [...acc[entry], { ...cur, y: cur.y + offset * acc[entry].length }]
			};
		} else {
			return { ...acc, [entry]: [cur] };
		}
	}, {});

	const result = Object.values(histo)
		.flat()
		.map((d, i) => {
			return {
				...d,
				y: -d.y + fy,
				r,
				withinClusterIndex: i * 10
			};
		});

	return result;
};

export { move, transformSvg, scaleCanvas, layoutHistogram };
