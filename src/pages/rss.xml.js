import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';

export async function GET(context) {
	const posts = (await getCollection('posts')).sort(
		(a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
	);
	return rss({
		// Hoja de estilo: al abrir /rss.xml en el navegador se ve como página, no como código.
		stylesheet: '/rss-styles.xsl',
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		items: posts.map((post) => ({
			title: post.data.title,
			pubDate: post.data.date,
			description: post.data.category
				? `${post.data.category}${post.data.author ? ' · ' + post.data.author : ''}`
				: '',
			link: `/blog/${post.id}/`,
		})),
	});
}
