import { getSearch } from '$lib/server/breweries';
import { jsonResponse, parseOrigin, parseUnit } from '$lib/server/api-helpers';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const query = url.searchParams.get('q')?.trim() ?? '';
	if (!query) {
		return jsonResponse({ results: [], unit: parseUnit(url) });
	}
	try {
		const origin = parseOrigin(url);
		const unit = parseUnit(url);
		const result = await getSearch(query, origin, unit);
		return jsonResponse(result);
	} catch (err) {
		return jsonResponse(
			{ error: 'search_failed', message: String(err) },
			{ 'Cache-Control': 'no-store' }
		);
	}
};
