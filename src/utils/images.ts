/**
 * Utilidades para optimización responsiva y entrega de imágenes en Cloudinary.
 * Transforma URLs crudas en versiones adaptadas a cada dispositivo y densidad de píxeles:
 * formato auto (AVIF/WebP), compresión inteligente (q_auto), recorte inteligente y dimensiones exactas.
 */

export interface ImageTransformOptions {
	width?: number;
	height?: number;
	crop?: 'fill' | 'fit' | 'limit' | 'scale' | 'pad' | 'thumb';
	gravity?: 'auto' | 'center' | 'north' | 'south' | 'face' | 'faces';
	quality?: 'auto' | 'auto:good' | 'auto:best' | 'auto:eco' | 'auto:low' | number;
	format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png';
}

const CLOUDINARY_CLOUD_NAME = 'cs8tnt88';
const UPLOAD_MARKER = '/image/upload/';
const FETCH_MARKER = '/image/fetch/';

/**
 * Retorna la URL optimizada con las transformaciones de Cloudinary deseadas.
 * Si la imagen es SVG o no es de Cloudinary ni remota, la devuelve intacta o usa fetch si aplica.
 */
export function getOptimizedImageUrl(
	url: string | null | undefined,
	options: ImageTransformOptions = {},
): string {
	if (!url) return '/default-cover.svg';

	// No transformar SVGs locales
	if (url.endsWith('.svg')) return url;

	const {
		width,
		height,
		crop = 'fill',
		gravity = 'auto',
		quality = 'auto:good',
		format = 'auto',
	} = options;

	// Construir fragmento de transformación
	const parts: string[] = [];
	if (width) parts.push(`w_${width}`);
	if (height) parts.push(`h_${height}`);
	if (crop && (width || height)) parts.push(`c_${crop}`);
	if (gravity && crop !== 'scale' && crop !== 'fit') parts.push(`g_${gravity}`);
	if (format) parts.push(`f_${format}`);
	if (quality) parts.push(`q_${quality}`);

	const transform = parts.join(',');

	// Caso 1: Imagen directa en Cloudinary Upload
	if (url.includes('res.cloudinary.com') && url.includes(UPLOAD_MARKER)) {
		const idx = url.indexOf(UPLOAD_MARKER);
		const prefix = url.slice(0, idx + UPLOAD_MARKER.length);
		const rest = url.slice(idx + UPLOAD_MARKER.length);

		// Si ya tiene parámetros de transformación previos antes de la versión v123...,
		// los preservamos o insertamos los nuestros de forma limpia.
		return `${prefix}${transform}/${rest}`;
	}

	// Caso 2: Cloudinary Fetch existente
	if (url.includes('res.cloudinary.com') && url.includes(FETCH_MARKER)) {
		const idx = url.indexOf(FETCH_MARKER);
		const prefix = url.slice(0, idx + FETCH_MARKER.length);
		const rest = url.slice(idx + FETCH_MARKER.length);
		return `${prefix}${transform}/${rest}`;
	}

	// Caso 3: URL absoluta externa que no está en Cloudinary -> usar Cloudinary Fetch proxy
	if (url.startsWith('http://') || url.startsWith('https://')) {
		return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/fetch/${transform}/${encodeURIComponent(url)}`;
	}

	// Caso 4: Ruta local o subida relativa (ej. /uploads/foto.jpg)
	if (url.startsWith('/uploads/')) {
		const absUrl = `https://abuliaterminal.cl${url}`;
		return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/fetch/${transform}/${encodeURIComponent(absUrl)}`;
	}

	return url;
}

/**
 * Genera un conjunto de srcset responsivo para una imagen dada.
 */
export function getResponsiveSrcSet(
	url: string | null | undefined,
	widths: number[] = [480, 768, 1080, 1400],
	aspectRatio?: number, // ej: 16/9 o 3/2 o 5/6
): string {
	if (!url || url.endsWith('.svg')) return '';

	return widths
		.map((w) => {
			const h = aspectRatio ? Math.round(w / aspectRatio) : undefined;
			const optUrl = getOptimizedImageUrl(url, {
				width: w,
				height: h,
				crop: 'fill',
				gravity: 'auto',
				format: 'auto',
				quality: 'auto:good',
			});
			return `${optUrl} ${w}w`;
		})
		.join(', ');
}
