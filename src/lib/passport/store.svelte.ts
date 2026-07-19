/* Beer Passport — on-device persistence store (no accounts, no backend).
 *
 * Holds: favorites (saved breweries), stamps (visited breweries), and recent
 * searches. Backed by localStorage, exposed as a Svelte 5 runes store so any
 * component can read/write reactively. Data never leaves the device.
 */

import { browser } from '$app/environment';

const KEY = 'hop-portugal:passport:v1';

interface PassportData {
	favorites: string[];
	stamps: string[];
	recentSearches: string[];
}

const EMPTY: PassportData = { favorites: [], stamps: [], recentSearches: [] };

function load(): PassportData {
	if (!browser) return EMPTY;
	try {
		const raw = localStorage.getItem(KEY);
		if (!raw) return EMPTY;
		const parsed = JSON.parse(raw) as Partial<PassportData>;
		return {
			favorites: parsed.favorites ?? [],
			stamps: parsed.stamps ?? [],
			recentSearches: parsed.recentSearches ?? []
		};
	} catch {
		return EMPTY;
	}
}

function persist(data: PassportData): void {
	if (!browser) return;
	try {
		localStorage.setItem(KEY, JSON.stringify(data));
	} catch {
		/* storage full or unavailable — fail silently, app stays usable */
	}
}

class PassportStore {
	#data = $state<PassportData>(EMPTY);

	constructor() {
		if (browser) this.#data = load();
	}

	#commit() {
		persist(this.#data);
	}

	get favorites(): readonly string[] {
		return this.#data.favorites;
	}
	get stamps(): readonly string[] {
		return this.#data.stamps;
	}
	get recentSearches(): readonly string[] {
		return this.#data.recentSearches;
	}

	isFavorite(id: string): boolean {
		return this.#data.favorites.includes(id);
	}
	isStamped(id: string): boolean {
		return this.#data.stamps.includes(id);
	}

	toggleFavorite(id: string): void {
		if (this.isFavorite(id)) {
			this.#data.favorites = this.#data.favorites.filter((x) => x !== id);
		} else {
			this.#data.favorites = [...this.#data.favorites, id];
		}
		this.#commit();
	}

	stamp(id: string): void {
		if (!this.isStamped(id)) {
			this.#data.stamps = [...this.#data.stamps, id];
			this.#commit();
		}
	}

	unstamp(id: string): void {
		this.#data.stamps = this.#data.stamps.filter((x) => x !== id);
		this.#commit();
	}

	toggleStamp(id: string): void {
		if (this.isStamped(id)) this.unstamp(id);
		else this.stamp(id);
	}

	addRecentSearch(term: string): void {
		const t = term.trim();
		if (!t) return;
		this.#data.recentSearches = [t, ...this.#data.recentSearches.filter((x) => x !== t)].slice(
			0,
			8
		);
		this.#commit();
	}

	clearRecentSearches(): void {
		this.#data.recentSearches = [];
		this.#commit();
	}
}

export const passport = new PassportStore();
