import awards from '$data/awards.csv';

export const get = async () => {
	return { body: awards };
};
