import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * @function
 * @name timeline.js
 * @description Integrate a GSAP timeline into any element via an Action or Transition.
 * @see {@link https://greensock.com GSAP}
 * @param {Element} node - A DOM element passed by default in with a {@link https://svelte.dev/docs#template-syntax-element-directives-use-action Svelte action}.
 * @param {Object|Object[]} [tween] - A tween object of list of tween objects that contains the properties to specify a GSAP animation.
 * @param {Object} [tween.target] - Optional. A CSS selector or DOM element to target. If not specified, the tween will be applied to the node itself.
 * @param {('from' | 'to' | 'fromTo' | 'set')} [tween.type] - The GSAP tween. {@link https://greensock.com/docs/v3/GSAP/gsap.from()|'from'}: A backwards tween where you define where the values should START, and then it animates to the current state which is perfect for animating objects onto the screen because you can set them up the way you want them to look at the end and then animate in from elsewhere. {@link https://greensock.com/docs/v3/GSAP/gsap.to()|'to'}: The most common type of animation is a to() tween because it allows you to define the destination values (and most people think in terms of animating to certain values)
 * @param {Object} [tween.args] - Accepts any properties than can be passed to {@link https://greensock.com/docs/v3/GSAP/gsap.from()|GSAP.from()} and {@link https://greensock.com/docs/v3/GSAP/gsap.to()|GSAP.to()}
 * @param {Boolean} [children] - Whether the tween should be individually applied to the node's children or to the node itself.
 * @param {Boolean|Object} [scrollTrigger] - Use GSAP's {@link https://greensock.com/scrolltrigger/| ScrollTrigger} to play the animation when the element is in the viewport. Parameters passed will be forwarded to ScrollTrigger.
 * @param {Object} [args] - Accepts any properties than can be passed to {@link https://greensock.com/docs/v3/GSAP/Timeline| GSAP.timeline()}.
 * @example <div use:timeline={{ children: true, ease: 'power3.out', scrollTrigger: { scrub: 1, start: 'top 90%' }, tween: { x: (i) => i * 50, scale: (i) => i * 0.25 + 1, rotate: -315, stagger: 0.25, duration: 2 }}}>...</div>
 * @example <h1 use:animate={{ tween:{ type: 'fromTo', from: { x: -10, opacity:0 }, x: 0, opacity: 1, delay: 0.3, duration: 0.6 }}}>Hello world</h1>
 */

const DEFAULTS = {
	ease: 'power2.out',
	start: 'top center'
};

export default (node, { tween, children, scrollTrigger, ...args }) => {
	const timelineArgs = scrollTrigger
		? { scrollTrigger: { trigger: node, start: DEFAULTS.start, ...scrollTrigger }, ...args }
		: { ...args };

	const timeline = gsap.timeline(timelineArgs);

	if (!Array.isArray(tween)) {
		tween = [tween];
	}

	tween.forEach(({ target, type = 'to', position = 0, ...args }) => {
		if (typeof target === 'string' || target instanceof String) {
			target = node.querySelectorAll(target);
		}

		const targets = target || (children && node.children) || node;

		if (type === 'fromTo') {
			timeline[type](targets, { ...args.from }, { ease: DEFAULTS.ease, ...args }, position);
		} else {
			timeline[type](targets, { ease: DEFAULTS.ease, ...args }, position);
		}
	});

	return {
		destroy() {
			timeline.kill();
		}
	};
};
