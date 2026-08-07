// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';

/**
 * Los textos pegados desde Word/Docs suelen traer una tabulación (o 4 espacios)
 * al inicio de cada párrafo. Markdown interpreta eso como "bloque de código" y
 * lo muestra en cajas monoespaciadas feas. Como esta es una revista literaria y
 * no usamos código, convertimos cualquier bloque de código indentado en párrafos
 * normales. Así el cuerpo se ve siempre parejo, sin importar cómo se pegue.
 */
function remarkTidyProse() {
	const clean = (s) => String(s).replace(/​/g, '').replace(/[ \t]+/g, ' ').trim();
	const walk = (node) => {
		if (!node || !Array.isArray(node.children)) return;
		for (let i = 0; i < node.children.length; i++) {
			const child = node.children[i];
			if (child && child.type === 'code') {
				const paras = clean(child.value)
					.split(/\n{2,}/)
					.map((p) => clean(p))
					.filter(Boolean)
					.map((text) => ({ type: 'paragraph', children: [{ type: 'text', value: text }] }));
				const replacement = paras.length
					? paras
					: [{ type: 'paragraph', children: [{ type: 'text', value: clean(child.value) }] }];
				node.children.splice(i, 1, ...replacement);
				i += replacement.length - 1;
			} else {
				walk(child);
			}
		}
	};
	return (tree) => walk(tree);
}

// https://astro.build/config
export default defineConfig({
	markdown: {
		remarkPlugins: [remarkTidyProse],
	},
	// TODO: reemplaza por la URL real de tu sitio en Netlify (afecta sitemap, RSS y canonical)
	site: 'https://abuliaterminal.netlify.app',
	integrations: [mdx(), sitemap()],
	fonts: [
		{
			provider: fontProviders.local(),
			name: 'Atkinson',
			cssVariable: '--font-atkinson',
			fallbacks: ['sans-serif'],
			options: {
				variants: [
					{
						src: ['./src/assets/fonts/atkinson-regular.woff'],
						weight: 400,
						style: 'normal',
						display: 'swap',
					},
					{
						src: ['./src/assets/fonts/atkinson-bold.woff'],
						weight: 700,
						style: 'normal',
						display: 'swap',
					},
				],
			},
		},
	],
});
