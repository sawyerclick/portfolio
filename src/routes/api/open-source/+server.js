import { json } from '@sveltejs/kit';
import openSource from '$lib/data/open-source.yaml';

export const GET = async () => {
	// throw new Error("@migration task: Migrate this return statement (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292701)");
	// Suggestion (check for correctness before using):
	return json(openSource);
	// return {
	// 	body: openSource
	// };
};
