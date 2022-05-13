import awards from '$lib/data/awards.yaml';

export const get = async () => {
	return {
		body: awards
	};
};
