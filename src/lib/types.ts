/* Jolazz — domain types
 * The Brewery shape models the FULL future product (per brief) with optional
 * fields. Only fields the upstream source (Open Brewery DB) can supply are
 * populated today; enrichment + future features fill the rest. Nothing is
 * fabricated — absent optional fields are simply undefined and rendered as
 * honest empty states.
 */

export type BreweryType =
	| 'micro'
	| 'nano'
	| 'regional'
	| 'brewpub'
	| 'large'
	| 'planning'
	| 'bar'
	| 'contract'
	| 'proprietor'
	| 'closed';

export type DistanceUnit = 'km' | 'mi';

export interface Coordinates {
	lat: number;
	lng: number;
}

export interface Beer {
	id: string;
	breweryId: string;
	name: string;
	style?: string;
	abv?: number;
}

export interface BreweryEvent {
	id: string;
	breweryId: string;
	title: string;
	date?: string;
	description?: string;
}

export interface Brewery {
	/* --- core identity (from Open Brewery DB) --- */
	id: string;
	name: string;
	breweryType: BreweryType;
	address1?: string | null;
	address2?: string | null;
	address3?: string | null;
	city?: string | null;
	stateProvince?: string | null;
	postalCode?: string | null;
	country?: string | null;
	coordinates?: Coordinates | null;
	phone?: string | null;
	website?: string | null;

	/* --- enrichment layer (optional, pluggable) --- */
	description?: string | null;
	photos?: string[];
	logo?: string | null;

	/* --- future shape (optional, extension points) --- */
	instagram?: string | null;
	openingHours?: string | null;
	takeaway?: boolean;
	taproom?: boolean;
	foodAvailable?: boolean;
	dogFriendly?: boolean;
	wheelchairAccessible?: boolean;
	beers?: Beer[];
	events?: BreweryEvent[];

	/* --- computed at request time --- */
	distanceMeters?: number;
}

export interface Filters {
	openNow?: boolean;
	dogFriendly?: boolean;
	food?: boolean;
	taproom?: boolean;
	brewpub?: boolean;
	eventsToday?: boolean;
	familyFriendly?: boolean;
	outdoorSeating?: boolean;
	accessible?: boolean;
	breweryType?: BreweryType;
	maxDistanceMeters?: number;
}

export interface ExploreQuery {
	origin: Coordinates;
	unit: DistanceUnit;
	filters?: Filters;
}

export interface ExploreResult {
	featured: Brewery;
	nearby: Brewery[];
	hasEventsToday: boolean;
	unit: DistanceUnit;
}

export interface SearchResult {
	results: Brewery[];
	unit: DistanceUnit;
}

export interface BreweryDetailResult {
	brewery: Brewery;
	unit: DistanceUnit;
}
