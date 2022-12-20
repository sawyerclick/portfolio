import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import { createFocusTrap } from 'focus-trap';

/**
 * @function
 * @name modalize.js
 * @description Create an a11y modal from any element
 * @see {@link https://svelte.dev/repl/10efe8beb1ac4f4c8228f5c64f6baf44|Tutorial}
 * @param {Element} node - A node element to create the modal from. Typically will be an image or video but can technically be any element
 * @example <video src="https://www.youtube.com/watch?v=dQw4w9WgXcQ" use:modalize/>
 */
export default (node) => {
	let modal;
	let sourceStyles;
	let targetStyles;
	let trap;

	node.classList.add('modalize-source');

	if (!document.getElementById('modalize-styles-source')) {
		sourceStyles = document.createElement('style');
		sourceStyles.id = 'modalize-styles-source';
		sourceStyles.textContent = `
		:root {
			--modalize-source-icon: '+';
			--modalize-source-icon-color: #ffffff;
			--modalize-source-icon-background: #000000;
			--modalize-source-icon-opacity-before: 0;
			--modalize-source-icon-opacity-after: 1;
			--modalize-source-icon-transition: all 150ms ease-out;
		}
		.modalize-source {
				cursor: zoom-in;
				position: relative;
			}
			.modalize-source::after {
				content: var(--modalize-source-icon);
				position: absolute;
				right: 6px;
				bottom: 12px;
				transform: translateY(6px);
				font-size: 2.5rem;
				line-height: .5;
				border-radius: 2px;
				padding: 6px;
				color: var(--modalize-source-icon-color);
				background: var(--modalize-source-icon-background);
				opacity: var(--modalize-source-icon-opacity-before);
				transition: var(--modalize-source-icon-transition);
			}
			.modalize-source:focus { 
				outline: none; 
			}
			.modalize-source:where(:hover, :focus)::after {
				transform: translateY(0);
				opacity: var(--modalize-source-icon-opacity-after);
			}`;
		document.head.appendChild(sourceStyles);
	}

	// remove nodes + classes + deactivate traps
	const reset = () => {
		node.classList.remove('modalize-source-active');
		trap.deactivate();
		enableBodyScroll(modal);
		targetStyles.remove();
		modal.remove();
		return;
	};

	// keyboard friendly way of exiting the modal
	const escapeModal = (event) => {
		if (event.code !== 'Escape') return;
		reset();
	};

	const click = (event) => {
		// reset if already exists
		if (node.classList.contains('modalize-source-active')) {
			return reset();
		}

		node.classList.add('modalize-source-active');

		modal = document.createElement('div');
		modal.id = 'modalize';
		modal.onclick = (event) => {
			if (!node.contains(event.target)) reset();
		};

		// mouseover events for hover styling
		const button = document.createElement('button');
		button.classList.add('modalize-button');
		button.setAttribute('aria-label', 'Exit modal');
		button.innerHTML = '&times;';
		button.onclick = reset;

		const wrapper = document.createElement('div');
		wrapper.classList.add('modalize-wrapper');

		const node = node.cloneNode(true);
		node.removeAttribute('tabindex');
		node.classList.add('modalize-target');
		node.classList.remove('modalize-source', 'modalize-source-active');

		targetStyles = document.createElement('style');
		targetStyles.id = 'modalize-styles-target';
		targetStyles.textContent = `
		:root {
			--modalize-z-index: 9999;
			--modalize-top: 0px;
			--modalize-right: 0px;
			--modalize-bottom: 0px;
			--modalize-left: 0px;
			--modalize-width: 100%;
			--modalize-height: 100%;
			--modalize-padding: 0;
			--modalize-background: rgba(25,25,25,.8);
			--modalize-backdrop-filter: blur(3px);
			--modalize-user-select: none;
			--modalize-overflow: auto;
			
			--item-padding: 1rem;
			--item-margin: 0;
			--item-size: calc(100% - var(--item-padding) * 2);
			--item-width: var(--item-size);
			--item-height: var(--item-size);
			--item-object-fit: contain;
			--item-overflow: hidden;
			--item-transform-before: scale(.75);
			--item-transform-after: scale(1);
			--item-transition: all 300ms ease;
			
			--btn-position: absolute;
			--btn-top: .5rem;
			--btn-right: .5rem;
			--btn-bottom: initial;
			--btn-left: initial;
			--btn-cursor: pointer;
			--btn-background: var(--modalize-background);
      --btn-background-hover: var(--btn-background);
			--btn-color: rgba(255, 255, 255, 1);
			--btn-color-hover: var(--btn-color);
			--btn-font-size: 1.5rem;
			--btn-padding: .25rem .25rem .5rem;
			--btn-margin: 0;
			--btn-size: 2rem;
			--btn-width: var(--btn-size);
			--btn-height: var(--btn-height);
			--btn-border: none;
			--btn-border-radius: 2px;
			--btn-transition: none;
		}

		#modalize {
			position: fixed;
      z-index: var(--modalize-z-index);
			top: var(--modalize-top);
			right: var(--modalize-right);
			bottom: var(--modalize-bottom);
			left: var(--modalize-left);
			width: var(--modalize-width);
			height: var(--modalize-height);
			padding: var(--modalize-padding);
			background: var(--modalize-background);
			-webkit-backdrop-filter: var(--modalize-backdrop-filter);
			backdrop-filter: var(--modalize-backdrop-filter);
			user-select: var(--modalize-user-select);
			overflow: var(--modalize-overflow);
		}

		#modalize .modalize-wrapper {
			width: 100%;
			height: 100%;
			padding: 0;
			margin: 0 auto;
			display: flex;
			justify-content: center;
			align-items: center;
		}

		#modalize .modalize-target {
			display: block;
			width: var(--item-width);
			max-width: var(--item-width);
			height: var(--item-height);
			max-height: var(--item-size);
			object-fit: var(--item-object-fit);
			overflow: var(--item-overflow);
			padding: var(--item-padding);
			margin: var(--item-margin);
			transform: var(--item-transform-before);
			transform-origin: var(--item-transform-origin);
			transition: var(--item-transition);
		}

    #modalize .modalize-target img {
      width: 100%;
      height: 100%;
      object-fit: var(--item-object-fit);
    }

		#modalize button {
			position: var(--btn-position);
			top: var(--btn-top);
			right: var(--btn-right);
			bottom: var(--btn-bottom);
			left: var(--btn-left);
			z-index: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			vertical-align: middle;
			cursor: var(--btn-cursor);
			background: var(--btn-background);
			color: var(--btn-color);
			font-size: var(--btn-font-size);
			line-height: 1;
			padding: var(--btn-padding);
			margin: var(--btn-margin);
			width: var(--btn-width);
			height: var(--btn-height);
			border: var(--btn-border, none);
			border-radius: var(--btn-border-radius);
			transition: var(--btn-transition);
		}

		#modalize button:where(:hover, :focus) {
			background: var(--btn-background-hover);
			color: var(--btn-color-hover);
		}`;

		// create div structure
		modal.appendChild(button);
		wrapper.appendChild(node);
		modal.appendChild(wrapper);

		// append nodes
		document.head.appendChild(targetStyles);
		document.body.appendChild(modal);

		// set up focus trap and body scroll lock
		disableBodyScroll(modal);
		trap = createFocusTrap(modal);
		trap.activate();

		// need the 0 delay for transition to work
		setTimeout(() => (node.style.transform = 'var(--item-transform-after)'), 0);

		node.dispatchEvent(new CustomEvent('fullscreen', node));
		window.addEventListener('keydown', escapeModal);
		return;
	};

	node.addEventListener('click', click, true);
	// if element is focused and enter is pressed
	window.addEventListener(
		'keydown',
		(event) => {
			if (event.code === 'Enter' && node === document.activeElement) click();
		},
		true
	);

	return {
		destroy() {
			window.removeEventListener('keydown', escapeModal, true);
		}
	};
};
