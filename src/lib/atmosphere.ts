/* Hop Portugal — atmosphere imagery.
 *
 * Open Brewery DB ships zero photos. The product brief asks for *atmosphere*:
 * premium craft-beer photography (taprooms, glasses, hops, barrels, pours)
 * that makes every screen feel like an App Store screenshot. These images are
 * deliberately generic — they are NOT the real brewery and are never labelled
 * as such. They exist only to create warmth and visual weight.
 *
 * Architecture is swap-ready: when a real `Enricher` (Google Places, a CMS,
 * etc.) populates `brewery.photos`, those take precedence everywhere via
 * `atmospherePhoto()`. See `src/lib/server/enrichment.ts`.
 *
 * Photos are served from the Unsplash CDN with stable IDs + sizing params.
 * Each brewery maps deterministically to one image (stable per id) so the UI
 * does not flicker between renders.
 */

import type { Brewery } from '$lib/types';

/** Curated craft-beer atmosphere photography (Unsplash, stable IDs). */
const ATMOSPHERE_PHOTOS: string[] = [
	'photo-1535958636474-b021ee887b13', // tasting flight of golden ales
	'photo-1571612246035-b9450299a586', // amber pour into glass
	'photo-1567696911980-2eed69a46042', // barrel room interior
	'photo-1518176258769-f227c798150e', // hop cones close-up
	'photo-1559656914-a30970c1a590', // taproom bar with hanging glasses
	'photo-1534509381460-3aa77914aee3', // copper brewing tanks
	'photo-1608270586620-248524c67de9', // beer flight on wooden table
	'photo-1575037617878-1c4d8c1c2f1e', // craft lager with foam
	'photo-1543519536-0a2b59c4d3c0', // brewery vats and pipes
	'photo-1614316644294-c16b6ea67248', // hop garden rows
	'photo-1546171753-97d7676e4602', // dark moody stout pour
	'photo-1553362906-bdf2e3355bb6' // tap handles line-up
];

function unsplash(id: string, w: number, h: number): string {
	return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&h=${h}&q=70`;
}

/** Stable per-brewery photo id derived from the brewery id. */
function photoIdFor(brewery: Brewery): string {
	let hash = 0;
	for (let i = 0; i < brewery.id.length; i++) {
		hash = (hash * 31 + brewery.id.charCodeAt(i)) | 0;
	}
	const idx = Math.abs(hash) % ATMOSPHERE_PHOTOS.length;
	return ATMOSPHERE_PHOTOS[idx];
}

export interface AtmosphereOptions {
	/** Requested pixel width (defaults tuned for retina mobile). */
	width?: number;
	/** Requested pixel height. */
	height?: number;
}

/**
 * Returns a real photo URL for the brewery, preferring any genuine
 * `brewery.photos` (from a live enricher) and falling back to deterministic
 * atmosphere photography. `null` is never returned by callers' design —
 * if a brewery has neither, the UI should use `BreweryPhoto` component which
 * shows a styled gradient fallback. This helper is only used where a photo is
 * guaranteed to be shown.
 */
export function atmospherePhoto(brewery: Brewery, opts: AtmosphereOptions = {}): string {
	const width = opts.width ?? 800;
	const height = opts.height ?? 500;
	if (brewery.photos && brewery.photos.length > 0) return brewery.photos[0];
	return unsplash(photoIdFor(brewery), width, height);
}

/** Hero-sized atmosphere photo (16:10 editorial crop). */
export function heroPhoto(brewery: Brewery): string {
	return atmospherePhoto(brewery, { width: 1200, height: 750 });
}

/** Card-sized atmosphere photo (16:10). */
export function cardPhoto(brewery: Brewery): string {
	return atmospherePhoto(brewery, { width: 800, height: 500 });
}

/** Small thumbnail (square-ish). */
export function thumbPhoto(brewery: Brewery): string {
	return atmospherePhoto(brewery, { width: 400, height: 400 });
}
