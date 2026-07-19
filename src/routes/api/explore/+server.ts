import { getExplore } from '$lib/server/breweries';
import { jsonResponse, parseOrigin, parseUnit } from '$lib/server/api-helpers';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	try {
		const origin = parseOrigin(url);
		const unit = parseUnit(url);
		const filters = parseFilters(url);
		const result = await getExplore({ origin, unit, filters });
		return jsonResponse(result);
	} catch (err) {
		return jsonResponse(
			{ error: 'explore_failed', message: String(err) },
			{ 'Cache-Control': 'no-store' }
		);
	}
};

function parseFilters(url: URL) {
	const f: Record<string, string | null> = {};
	for (const key of [
		'openNow',
		'dogFriendly',
		'food',
		'taproom',
		'brewpub',
		'eventsToday',
		'familyFriendly',
		'outdoorSeating',
		'accessible'
	]) {
		if (url.searchParams.has(key)) f[key] = url.searchParams.get(key);
	}
	const breweryType = url.searchParams.get('breweryType');
	const maxKm = url.searchParams.get('maxDistanceKm');
	const filters: Record<string, unknown> = {};
	for (const [k, v] of Object.entries(f)) {
		if (v === 'true' || v === '1') filters[k] = true;
	}
	if (breweryType) filters.breweryType = breweryType;
	if (maxKm && Number(maxKm)) filters.maxDistanceMeters = Number(maxKm) * 1000;
	return Object.keys(filters).length ? filters : undefined;
}
