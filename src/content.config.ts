import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Categorías disponibles (deben coincidir con public/admin/config.yml)
export const CATEGORIES = [
	'Cine',
	'Reseña',
	'Crítica',
	'Género',
	'Columna',
	'Poesía',
	'Novedades',
	'Ensayo',
	'Fotografía',
	'Crónica',
	'Creación Abúlica',
	'Cuento',
	'Artículo',
] as const;

// Slug de una categoría para las URLs /categorias/[slug]:
// minúsculas, sin acentos, espacios convertidos en guiones.
// Fuente única para el menú (Header) y las rutas ([category].astro).
export const categorySlug = (name: string): string =>
	name
		.toLowerCase()
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '')
		.replace(/\s+/g, '-');

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
		// Ruta pública a la imagen principal subida desde el CMS (ej: /uploads/foto.jpg)
		heroImage: z.string().optional(),
		// Encaje de la portada (object-position): "center", "top", "left bottom", etc.
		imagePosition: z.string().optional().default('center'),
		// Bio del autor para este texto (si se deja vacío, se usa la de la colección "authors").
		authorBio: z.string().optional(),
		// Bibliografía / obras citadas (una entrada por línea). Se muestra en bloque aparte.
		citations: z.string().optional(),
		// Etiquetas por tema (lista). Opcional: los textos antiguos sin etiquetas siguen igual.
		tags: z.array(z.string()).optional(),
		// Justificar el cuerpo del texto (como en Word). Por defecto sí.
		justify: z.boolean().optional().default(true),
	}),
});

// Colección de autores: memoria reutilizable de nombre + biografía.
// La bio se escribe en el cuerpo del archivo (markdown) y se muestra al final de cada texto.
const authors = defineCollection({
	loader: glob({ base: './src/content/authors', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		name: z.string(),
	}),
});

// Páginas fijas del sitio (línea editorial, manifiesto, colaborar, contacto),
// editables desde el panel. El cuerpo va en el markdown del archivo.
const pages = defineCollection({
	loader: glob({ base: './src/content/pages', pattern: '**/*.md' }),
	schema: z.object({
		title: z.string(),
		kicker: z.string().optional(),
		description: z.string().optional(),
	}),
});

export const collections = { posts, authors, pages };
