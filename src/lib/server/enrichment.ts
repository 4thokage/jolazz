/* Hop Portugal — optional enrichment layer.
 *
 * The upstream Brewery source (Open Brewery DB) does not provide logos,
 * photos, or descriptions. This module defines a swappable Enricher
 * interface and ships a NO-OP default so the app runs with zero API keys.
 *
 * To enable real enrichment, implement `Enricher` (e.g. a Google Places
 * adapter) and register it in `getEnricher()`. The product API merges the
 * result into the Brewery shape; absent data stays undefined and is rendered
 * as an honest empty state — never fabricated.
 */

import type { Brewery } from '$lib/types';

export interface Enrichment {
	description?: string | null;
	photos?: string[];
	logo?: string | null;
}

export interface Enricher {
	/** Enrich a single brewery. May be async and may return partial data. */
	enrich(brewery: Brewery): Promise<Enrichment>;
}

/** Default no-op enricher — returns nothing, app stays fully functional. */
const noopEnricher: Enricher = {
	async enrich() {
		return {};
	}
};

let active: Enricher | null = null;

/**
 * Returns the configured enricher. Swap the return value to plug in a real
 * provider (Google Places, a curated CMS, etc.). The interface is the
 * extension contract; this is intentionally the only place to change.
 */
export function getEnricher(): Enricher {
	if (active) return active;
	// Example future wiring:
	// if (env.GOOGLE_PLACES_API_KEY) active = new GooglePlacesEnricher(env.GOOGLE_PLACES_API_KEY);
	active = noopEnricher;
	return active;
}

/** Enrich many breweries, tolerating partial/enrichment failures. */
export async function enrichMany(breweries: Brewery[]): Promise<Brewery[]> {
	const enricher = getEnricher();
	return Promise.all(
		breweries.map(async (b) => {
			try {
				const extra = await enricher.enrich(b);
				return { ...b, ...extra };
			} catch {
				return b;
			}
		})
	);
}
