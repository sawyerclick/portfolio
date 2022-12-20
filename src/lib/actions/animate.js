import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * @function
 * @name animate.js
 * @description Integrate GSAP into any element via an Action or Transition.
 * @see {@link https://greensock.com|GSAP}
 * @param {Element} node - A node element to create the modal from. Typically will be an image or video but can technically be any element
 * @param {('from' | 'to')} type - The GSAP tween. {@link https://greensock.com/docs/v3/GSAP/gsap.from()|'from'}: A backwards tween where you define where the values should START, and then it animates to the current state which is perfect for animating objects onto the screen because you can set them up the way you want them to look at the end and then animate in from elsewhere. {@link https://greensock.com/docs/v3/GSAP/gsap.to()|'to'}: The most common type of animation is a to() tween because it allows you to define the destination values (and most people think in terms of animating to certain values)
 * @param {Boolean} children - Whether the tween should be individually applied to the node's children or to the node itself
 * @param {Boolean|Object} scrollTrigger - Use GSAP's {@link https://greensock.com/scrolltrigger/|ScrollTrigger} to play the animation when the element is in the viewport. Parameters passed will be forwarded to ScrollTrigger
 * @param {Object} args - Accepts any properties than can be passed to {@link https://greensock.com/docs/v3/GSAP/gsap.from()|GSAP.from()} and {@link https://greensock.com/docs/v3/GSAP/gsap.to()|GSAP.to()}
 * @example <video src="https://www.youtube.com/watch?v=dQw4w9WgXcQ" style="transform: scale(0);" use:animate={{ type: 'to', scale: 1, duration: .6, ease: 'power3.out' }} />
 * @example <h1 style="opacity:0;" in:animate={{ type: 'to', stagger: 0.05, x: 0, opacity: 1, delay: 0.3, duration: 0.6 }}>Hello world</h1>
 */
export default (node, { type = 'to', children, scrollTrigger, ...args }) => {
	let targets = children ? node.children : node;
	let timelineArgs = scrollTrigger
		? { scrollTrigger: { trigger: node, start: 'top center', ...scrollTrigger } }
		: {};
	let timeline = gsap
		.timeline(timelineArgs)
		[type](targets, { ease: 'power2.out', overwrite: true, ...args });

	return {
		update(params) {
			timeline.duration(params.duration);
		},
		destroy() {
			timeline.killTweensOf(targets);
		}
	};
};
