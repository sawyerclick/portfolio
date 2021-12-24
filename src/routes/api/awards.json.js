import awards from '$lib/data/awards.csv';

export const get = async () => {
	return { body: awards };
};
