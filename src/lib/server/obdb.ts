/* Hop Portugal — low-level Open Brewery DB client with aggressive caching.
 * Caches parsed responses in an in-memory TTL map keyed by URL. On Cloudflare
 * Pages this lives for the lifetime of the isolate; pair with Cache-Control
 * headers (set in the route handlers) for edge caching.
 */

import type { BreweryType, Coordinates } from '$lib/types';

const BASE = 'https://api.openbrewerydb.org/v1';

export interface ObdbBrewery {
	id: string;
	name: string;
	brewery_type: BreweryType;
	address_1?: string | null;
	address_2?: string | null;
	address_3?: string | null;
	city?: string | null;
	state_province?: string | null;
	postal_code?: string | null;
	country?: string | null;
	longitude?: number | null;
	latitude?: number | null;
	phone?: string | null;
	website_url?: string | null;
	street?: string | null;
}

interface CacheEntry {
	expires: number;
	data: unknown;
}

const TTL_MS = 10 * 60 * 1000; // 10 minutes
const cache = new Map<string, CacheEntry>();

function getCached<T>(key: string): T | undefined {
	const hit = cache.get(key);
	if (hit && hit.expires > Date.now()) return hit.data as T;
	cache.delete(key);
	return undefined;
}

function setCached(key: string, data: unknown): void {
	cache.set(key, { expires: Date.now() + TTL_MS, data });
}

async function obdbFetch<T>(
	path: string,
	params: Record<string, string | number | undefined>
): Promise<T> {
	const url = new URL(BASE + path);
	for (const [k, v] of Object.entries(params)) {
		if (v !== undefined && v !== '') url.searchParams.set(k, String(v));
	}
	const key = url.toString();
	const cached = getCached<T>(key);
	if (cached) return cached;

	const res = await fetch(
		key as RequestInfo,
		{
			headers: { Accept: 'application/json' }
		} as RequestInit
	);
	if (!res.ok) {
		throw new Error(`Open Brewery DB request failed: ${res.status} ${res.statusText}`);
	}
	const data = (await res.json()) as T;
	setCached(key, data);
	return data;
}

export function mapObdb(raw: ObdbBrewery) {
	const coordinates =
		typeof raw.latitude === 'number' && typeof raw.longitude === 'number'
			? { lat: raw.latitude, lng: raw.longitude }
			: null;
	return {
		id: raw.id,
		name: raw.name,
		breweryType: raw.brewery_type,
		address1: raw.address_1 ?? null,
		address2: raw.address_2 ?? null,
		address3: raw.address_3 ?? null,
		city: raw.city ?? null,
		stateProvince: raw.state_province ?? null,
		postalCode: raw.postal_code ?? null,
		country: raw.country ?? null,
		coordinates,
		phone: raw.phone ?? null,
		website: raw.website_url ?? null
	};
}

export async function obdbListNearby(origin: Coordinates, perPage = 50): Promise<ObdbBrewery[]> {
	return obdbFetch<ObdbBrewery[]>('/breweries', {
		by_country: 'Portugal',
		by_dist: `${origin.lat},${origin.lng}`,
		per_page: perPage
	});
}

export async function obdbSearch(query: string, perPage = 25): Promise<ObdbBrewery[]> {
	return obdbFetch<ObdbBrewery[]>('/breweries/search', {
		query,
		per_page: perPage
	});
}

export async function obdbGetById(id: string): Promise<ObdbBrewery> {
	return obdbFetch<ObdbBrewery>(`/breweries/${encodeURIComponent(id)}`, {});
}

export async function obdbGetByIds(ids: string[]): Promise<ObdbBrewery[]> {
	if (ids.length === 0) return [];
	return obdbFetch<ObdbBrewery[]>('/breweries', {
		by_ids: ids.join(','),
		per_page: ids.length
	});
}

export async function obdbMetaByCountry(): Promise<{ total: number }> {
	return obdbFetch<{ total: number }>('/breweries/meta', { by_country: 'Portugal' });
}
