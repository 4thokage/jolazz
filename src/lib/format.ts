/* Formatting helpers shared across screens. */

import type { Brewery, DistanceUnit } from '$lib/types';

export function formatDistance(meters: number | undefined, unit: DistanceUnit): string {
	if (meters === undefined || !Number.isFinite(meters)) return '';
	const km = meters / 1000;
	if (unit === 'mi') {
		const mi = km * 0.621371;
		return mi < 1 ? `${Math.round(mi * 5280)} ft` : `${mi.toFixed(1)} mi`;
	}
	return km < 1 ? `${Math.round(meters)} m` : `${km.toFixed(1)} km`;
}

export function formatAddress(b: Brewery): string {
	const parts = [b.address1, b.city, b.stateProvince, b.postalCode].filter(
		(v): v is string => typeof v === 'string' && v.length > 0
	);
	return parts.join(', ');
}

export function mapsDirectionsUrl(b: Brewery): string {
	if (b.coordinates) {
		return `https://www.google.com/maps/dir/?api=1&destination=${b.coordinates.lat},${b.coordinates.lng}`;
	}
	const q = encodeURIComponent([b.name, b.city, 'Portugal'].filter(Boolean).join(', '));
	return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

export function displayPhone(phone: string | null | undefined): string {
	if (!phone) return '';
	return phone.replace(/\s+/g, ' ').trim();
}

export function typeLabel(type: Brewery['breweryType']): string {
	const map: Record<Brewery['breweryType'], string> = {
		micro: 'Microbrewery',
		nano: 'Nano brewery',
		regional: 'Regional brewery',
		brewpub: 'Brewpub',
		large: 'Large brewery',
		planning: 'Opening soon',
		bar: 'Beer bar',
		contract: 'Contract brewery',
		proprietor: 'Proprietor',
		closed: 'Closed'
	};
	return map[type] ?? type;
}
