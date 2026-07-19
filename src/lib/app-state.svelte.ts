/* Shared client app state: origin + distance unit + filters.
 * A single runes source so every screen reads/writes the same location.
 */

import { browser } from '$app/environment';
import type { Coordinates, DistanceUnit, Filters } from '$lib/types';
import { loadOriginFromStorage, loadUnit, saveOrigin, saveUnit } from '$lib/geo';

class AppState {
	origin = $state<Coordinates>({ lat: 38.7223, lng: -9.1393 });
	unit = $state<DistanceUnit>('km');
	filters = $state<Filters>({});
	locating = $state(false);

	constructor() {
		if (browser) {
			this.origin = loadOriginFromStorage();
			this.unit = loadUnit();
		}
	}

	setOrigin(c: Coordinates) {
		this.origin = c;
		saveOrigin(c);
	}

	setUnit(u: DistanceUnit) {
		this.unit = u;
		saveUnit(u);
	}
}

export const appState = new AppState();
