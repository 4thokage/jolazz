/* Jolazz — domain assembly.
 * Composes Open Brewery DB data + enrichment into the product Brewery shape,
 * computes distance from an origin, and applies MVP filters.
 */

import type {
	Brewery,
	BreweryType,
	Coordinates,
	DistanceUnit,
	ExploreQuery,
	ExploreResult,
	Filters,
	SearchResult,
	Beer,
	BreweryEvent
} from '$lib/types';
import {
	obdbGetByIds,
	obdbGetById,
	obdbListNearby,
	obdbSearch,
	mapObdb,
	type ObdbBrewery
} from './obdb';
import { enrichMany } from './enrichment';

const EARTH_RADIUS_M = 6_371_000;

export function haversineMeters(a: Coordinates, b: Coordinates): number {
	const toRad = (d: number) => (d * Math.PI) / 180;
	const dLat = toRad(b.lat - a.lat);
	const dLng = toRad(b.lng - a.lng);
	const lat1 = toRad(a.lat);
	const lat2 = toRad(b.lat);
	const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
	return 2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(h));
}

function toBrewery(raw: ObdbBrewery): Brewery {
	const base = mapObdb(raw);
	return { ...base };
}

function withDistance(b: Brewery, origin: Coordinates): Brewery {
	if (!b.coordinates) return b;
	return { ...b, distanceMeters: haversineMeters(origin, b.coordinates) };
}

/** Infer a few optional amenities from brewery type where safe. */
function inferAmenities(b: Brewery): Brewery {
	const inferred: Partial<Brewery> = {};
	if (b.breweryType === 'brewpub') {
		inferred.foodAvailable = true;
		inferred.taproom = true;
	}
	if (b.breweryType === 'micro' || b.breweryType === 'nano') {
		inferred.taproom = true;
	}
	return { ...b, ...inferred };
}

function applyFilters(list: Brewery[], filters?: Filters): Brewery[] {
	if (!filters) return list;
	return list.filter((b: Brewery) => {
		if (filters.brewpub && b.breweryType !== 'brewpub') return false;
		if (filters.taproom && b.taproom === false) return false;
		if (filters.food && b.foodAvailable === false) return false;
		if (filters.dogFriendly && b.dogFriendly === false) return false;
		if (filters.accessible && b.wheelchairAccessible === false) return false;
		if (filters.breweryType && b.breweryType !== filters.breweryType) return false;
		if (filters.maxDistanceMeters && (b.distanceMeters ?? Infinity) > filters.maxDistanceMeters)
			return false;
		// openNow / eventsToday / familyFriendly / outdoorSeating are future
		// signals we cannot derive from the upstream source yet.
		return true;
	});
}

export async function getExplore(query: ExploreQuery): Promise<ExploreResult> {
	const raw = await obdbListNearby(query.origin, 50);
	let breweries = raw.map(toBrewery).map((b) => withDistance(b, query.origin));
	breweries = applyFilters(breweries, query.filters);
	breweries.sort((a, b) => (a.distanceMeters ?? Infinity) - (b.distanceMeters ?? Infinity));
	const enriched = await enrichMany(breweries);

	const featured = enriched[0];
	const nearby = enriched.slice(1, 21);

	// Events are a future feature; surface the flag as false until enrichment
	// provides them. Honest: we never claim events exist.
	const hasEventsToday = enriched.some((b) => (b.events?.length ?? 0) > 0);

	return {
		featured,
		nearby,
		hasEventsToday,
		unit: query.unit
	};
}

export async function getSearch(
	query: string,
	origin: Coordinates,
	unit: DistanceUnit
): Promise<SearchResult> {
	const raw = await obdbSearch(query, 25);
	const breweries = raw.map(toBrewery).map((b) => withDistance(b, origin));
	breweries.sort((a, b) => (a.distanceMeters ?? Infinity) - (b.distanceMeters ?? Infinity));
	const enriched = await enrichMany(breweries);
	return { results: enriched, unit };
}

export async function getBreweryById(
	id: string,
	origin: Coordinates,
	unit: DistanceUnit
): Promise<{ brewery: Brewery; unit: DistanceUnit }> {
	const raw = await obdbGetById(id);
	let brewery = toBrewery(raw);
	brewery = withDistance(brewery, origin);
	brewery = inferAmenities(brewery);
	const [enriched] = await enrichMany([brewery]);
	return { brewery: enriched, unit };
}

export async function getBreweriesByIds(
	ids: string[],
	origin: Coordinates,
	_unit: DistanceUnit
): Promise<Brewery[]> {
	const raw = await obdbGetByIds(ids);
	const breweries = raw.map(toBrewery).map((b) => withDistance(b, origin));
	breweries.sort((a, b) => (a.distanceMeters ?? Infinity) - (b.distanceMeters ?? Infinity));
	const enriched = await enrichMany(breweries);
	return enriched;
}

export type { Beer, BreweryEvent, BreweryType };
