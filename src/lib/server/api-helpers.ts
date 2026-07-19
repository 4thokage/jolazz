/* Shared request helpers for the product API. */

import type { Coordinates, DistanceUnit } from '$lib/types';

export const DEFAULT_ORIGIN: Coordinates = { lat: 38.7223, lng: -9.1393 }; // Lisbon

export function parseOrigin(url: URL): Coordinates {
	const lat = Number(url.searchParams.get('lat'));
	const lng = Number(url.searchParams.get('lng'));
	if (Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180) {
		return { lat, lng };
	}
	return DEFAULT_ORIGIN;
}

export function parseUnit(url: URL): DistanceUnit {
	return url.searchParams.get('unit') === 'mi' ? 'mi' : 'km';
}

export const CACHE_HEADERS: Record<string, string> = {
	'Cache-Control': 'public, max-age=600, stale-while-revalidate=3600'
};

export function jsonResponse(body: unknown, headers: Record<string, string> = CACHE_HEADERS) {
	return new Response(JSON.stringify(body), {
		headers: { 'Content-Type': 'application/json', ...headers }
	});
}
