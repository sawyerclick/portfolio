import pMap from "p-map"
import { basename } from "path"

export async function get() {
	const modules = Object.entries(import.meta.glob("../../blog/*.svelte.md"))

	const blogs = await pMap(
		modules,
		async ([filename, module]) => {
			const { metadata } = await module()

			return {
				...metadata,
				slug: basename(filename, ".svelte.md")
			}
		}
	)

	blogs.sort((a, b) => (new Date(a.created) > new Date(b.created) ? -1 : 1))

  return {
		body: { blogs }
	}
}