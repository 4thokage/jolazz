/* Client-side geolocation helper.
 * Resolves the user's position; falls back to Lisbon when denied/unavailable.
 * Also exposes unit + stored origin so screens share one source of truth.
 */

import { browser } from '$app/environment';
import type { Coordinates, DistanceUnit } from '$lib/types';

export const DEFAULT_ORIGIN: Coordinates = { lat: 38.7223, lng: -9.1393 };

export function loadOriginFromStorage(): Coordinates {
	if (!browser) return DEFAULT_ORIGIN;
	const raw = localStorage.getItem('hop-portugal:origin');
	if (raw) {
		try {
			const c = JSON.parse(raw) as Coordinates;
			if (typeof c.lat === 'number' && typeof c.lng === 'number') return c;
		} catch {
			/* ignore */
		}
	}
	return DEFAULT_ORIGIN;
}

export function saveOrigin(c: Coordinates): void {
	if (!browser) return;
	localStorage.setItem('hop-portugal:origin', JSON.stringify(c));
}

export function loadUnit(): DistanceUnit {
	if (!browser) return 'km';
	return localStorage.getItem('hop-portugal:unit') === 'mi' ? 'mi' : 'km';
}

export function saveUnit(unit: DistanceUnit): void {
	if (!browser) return;
	localStorage.setItem('hop-portugal:unit', unit);
}

export function requestLocation(): Promise<Coordinates> {
	return new Promise((resolve) => {
		if (!browser || !navigator.geolocation) {
			resolve(DEFAULT_ORIGIN);
			return;
		}
		navigator.geolocation.getCurrentPosition(
			(pos) => {
				const c = { lat: pos.coords.latitude, lng: pos.coords.longitude };
				saveOrigin(c);
				resolve(c);
			},
			() => resolve(loadOriginFromStorage()),
			{ enableHighAccuracy: false, timeout: 8000, maximumAge: 600000 }
		);
	});
}
