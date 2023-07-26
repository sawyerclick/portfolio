import { json } from '@sveltejs/kit';
import awards from '$lib/data/mentionables.yaml';

export const GET = async () => {
	// throw new Error("@migration task: Migrate this return statement (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292701)");
	// Suggestion (check for correctness before using):
	// return json(awards);
	return json(awards);
};
