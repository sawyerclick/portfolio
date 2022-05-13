import openSource from '$lib/data/open-source.yaml';

export const get = async () => {
	return {
		body: openSource
	};
};
