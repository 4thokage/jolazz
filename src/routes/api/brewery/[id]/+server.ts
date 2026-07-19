import { getBreweryById } from '$lib/server/breweries';
import { jsonResponse, parseOrigin, parseUnit } from '$lib/server/api-helpers';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, params }) => {
	try {
		const origin = parseOrigin(url);
		const unit = parseUnit(url);
		const { brewery } = await getBreweryById(params.id, origin, unit);
		return jsonResponse({ brewery, unit });
	} catch (err) {
		return jsonResponse(
			{ error: 'brewery_not_found', message: String(err) },
			{ 'Cache-Control': 'no-store' }
		);
	}
};
