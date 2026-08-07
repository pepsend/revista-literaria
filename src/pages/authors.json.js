import { getCollection } from 'astro:content';

// Lista de autores guardados, para sugerir (autocompletar) en el panel /admin.
export async function GET() {
	const authors = await getCollection('authors');
	const names = authors
		.map((a) => a.data.name)
		.filter(Boolean)
		.sort((a, b) => a.localeCompare(b, 'es'));
	return new Response(JSON.stringify(names), {
		headers: { 'Content-Type': 'application/json' },
	});
}
