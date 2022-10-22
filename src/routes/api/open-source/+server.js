import openSource from '$lib/data/open-source.yaml';

export const GET = async () => {
	return {
		body: openSource
	};
};
