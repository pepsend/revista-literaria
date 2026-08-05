import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Categorías disponibles (deben coincidir con public/admin/config.yml)
export const CATEGORIES = [
	'Ensayo',
	'Género',
	'Crítica',
	'Creación Abúlica',
	'Poesía',
	'Cuento',
	'Crónica',
	'Artículo',
] as const;

const posts = defineCollection({
	// Carga los artículos que el CMS escribe en src/content/posts/
	loader: glob({ base: './src/content/posts', pattern: '**/*.{md,mdx}' }),
	// El esquema coincide con los campos que genera Decap CMS
	schema: z.object({
		title: z.string(),
		// El CMS escribe "date"; se transforma a objeto Date
		date: z.coerce.date(),
		author: z.string().optional(),
		category: z.string().optional(),
	}),
});

export const collections = { posts };
