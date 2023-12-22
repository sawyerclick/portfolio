/** Dispatch event on click outside of node */
export default (node: Element, cb: Function) => {
	const handleClick = (event: MouseEvent) => {
		if (node && !node.contains(event.target as Node) && !event.defaultPrevented) {
			cb(node);
		}
	};

	document.addEventListener('click', handleClick, true);

	return {
		destroy() {
			document.removeEventListener('click', handleClick, true);
		}
	};
};
