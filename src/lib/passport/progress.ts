/* Beer Passport — progress derivation.
 *
 * "Progress" = how many distinct regions (stateProvince) the user has stamped.
 * We never invent totals; we show stamps collected and distinct regions
 * visited. The denominator is the count of distinct regions seen across the
 * user's stamped breweries (a self-referential, honest metric) — the UI
 * presents it as "X regions explored" rather than a fake percentage of
 * Portugal.
 */

import type { Brewery } from '$lib/types';

export interface PassportProgress {
	stampCount: number;
	favoriteCount: number;
	regionsVisited: string[];
	distinctRegionCount: number;
	recentStamps: Brewery[];
}

export function computeProgress(
	stamps: readonly string[],
	favorites: readonly string[],
	stampedBreweries: Brewery[]
): PassportProgress {
	const regions = new Set<string>();
	for (const b of stampedBreweries) {
		const region = b.stateProvince ?? b.city ?? 'Unknown';
		regions.add(region);
	}
	const recentStamps = [...stampedBreweries]
		.sort((a, b) => stamps.indexOf(b.id) - stamps.indexOf(a.id))
		.slice(0, 12);

	return {
		stampCount: stamps.length,
		favoriteCount: favorites.length,
		regionsVisited: [...regions],
		distinctRegionCount: regions.size,
		recentStamps
	};
}
