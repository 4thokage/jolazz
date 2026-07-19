/* Client-side product API client. Talks only to our own /api routes. */

import type { Brewery, Coordinates, DistanceUnit, ExploreResult, SearchResult } from '$lib/types';

function qs(origin: Coordinates, unit: DistanceUnit, extra: Record<string, string> = {}): string {
	const p = new URLSearchParams();
	p.set('lat', String(origin.lat));
	p.set('lng', String(origin.lng));
	p.set('unit', unit);
	for (const [k, v] of Object.entries(extra)) p.set(k, v);
	return p.toString();
}

export async function fetchExplore(
	origin: Coordinates,
	unit: DistanceUnit,
	filters?: Record<string, string>
): Promise<ExploreResult> {
	const res = await fetch(`/api/explore?${qs(origin, unit, filters)}`);
	if (!res.ok) throw new Error('explore_failed');
	return res.json();
}

export async function fetchSearch(
	query: string,
	origin: Coordinates,
	unit: DistanceUnit
): Promise<SearchResult> {
	const res = await fetch(`/api/search?${qs(origin, unit, { q: query })}`);
	if (!res.ok) throw new Error('search_failed');
	return res.json();
}

export async function fetchBrewery(
	id: string,
	origin: Coordinates,
	unit: DistanceUnit
): Promise<{ brewery: Brewery; unit: DistanceUnit }> {
	const res = await fetch(`/api/brewery/${encodeURIComponent(id)}?${qs(origin, unit)}`);
	if (!res.ok) throw new Error('brewery_not_found');
	return res.json();
}

export async function fetchBreweriesByIds(
	ids: string[],
	origin: Coordinates,
	unit: DistanceUnit
): Promise<{ results: Brewery[]; unit: DistanceUnit }> {
	if (ids.length === 0) return { results: [], unit };
	const res = await fetch(`/api/breweries?${qs(origin, unit, { ids: ids.join(',') })}`);
	if (!res.ok) throw new Error('breweries_failed');
	return res.json();
}
