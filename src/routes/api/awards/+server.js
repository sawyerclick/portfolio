import awards from '$lib/data/awards.yaml';

export const GET = async () => {
	return {
		body: awards
	};
};
