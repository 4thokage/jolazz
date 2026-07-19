import { getBreweriesByIds } from '$lib/server/breweries';
import { jsonResponse, parseOrigin, parseUnit } from '$lib/server/api-helpers';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const idsParam = url.searchParams.get('ids') ?? '';
	const ids = idsParam
		.split(',')
		.map((s) => s.trim())
		.filter(Boolean);
	if (ids.length === 0) {
		return jsonResponse({ results: [], unit: parseUnit(url) });
	}
	try {
		const origin = parseOrigin(url);
		const unit = parseUnit(url);
		const results = await getBreweriesByIds(ids, origin, unit);
		return jsonResponse({ results, unit });
	} catch (err) {
		return jsonResponse(
			{ error: 'breweries_failed', message: String(err) },
			{ 'Cache-Control': 'no-store' }
		);
	}
};
