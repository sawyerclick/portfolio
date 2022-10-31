import { gsap } from 'gsap/dist/gsap.js';

export default (node, { type, ...args }) => {
	let method = gsap[type];
	return method(node, args);
};
