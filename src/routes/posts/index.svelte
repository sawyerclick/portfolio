<script context="module">
	const mdFiles = import.meta.glob('./*.md');
	let body = [];

	for (const path in mdFiles) body.push(mdFiles[path]().then(({ metadata }) => metadata));

	export async function load() {
		const posts = await Promise.all(body);
		return {
			props: {
				posts
			}
		};
	}

	// 	export async function load({ fetch }) {
	// 	const url = '/api/work/graphics.json';
	// 	const res = await fetch(url);
	// 	if (res.ok) {
	// 		const projects = await res.json();
	// 		return {
	// 			props: { projects }
	// 		};
	// 	}
	// }
</script>

<script>
	export let posts = [];
	console.log(posts);
</script>

<h1 class="font-serif text-3xl">✍️ Sawyer's posts ✍️</h1>

<ul class="font-mono">
	{#each posts as post}
		<p>{JSON.stringify(post)}</p>
	{/each}
</ul>
