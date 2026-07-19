<script lang="ts">
	import { page } from '$app/state';
	import { m } from '$lib/paraglide/messages';
	import { fetchExplore } from '$lib/api';
	import { appState } from '$lib/app-state.svelte';
	import type { Brewery, ExploreResult } from '$lib/types';
	import { formatDistance, typeLabel } from '$lib/format';
	import Icon from '$lib/components/Icon.svelte';
	import BottomSheet from '$lib/components/BottomSheet.svelte';
	import Button from '$lib/components/Button.svelte';
	import Skeleton from '$lib/components/Skeleton.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';

	const params = $derived(page.url.searchParams);
	const origin = $derived({
		lat: Number(params.get('lat') ?? appState.origin.lat),
		lng: Number(params.get('lng') ?? appState.origin.lng)
	});
	const unit = $derived((params.get('unit') as 'km' | 'mi') ?? appState.unit);

	let mapEl = $state<HTMLDivElement | null>(null);
	let data = $state<ExploreResult | null>(null);
	let loading = $state(true);
	let selected = $state<Brewery | null>(null);
	// Leaflet is loaded from CDN at runtime; typed loosely.
	type LeafletMap = { setView: (c: [number, number], z: number) => void; remove: () => void };
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	type Leaflet = any;
	let map: LeafletMap | null = null;
	let leaflet: Leaflet | null = null;

	$effect(() => {
		let cancelled = false;
		loading = true;
		fetchExplore(origin, unit)
			.then((r) => {
				if (!cancelled) data = r;
			})
			.finally(() => {
				if (!cancelled) loading = false;
			});
		return () => {
			cancelled = true;
		};
	});

	$effect(() => {
		// Init map once container + data ready
		if (!mapEl || !data || map) return;
		loadLeaflet().then(() => {
			if (!leaflet || !mapEl || map) return;
			const L = leaflet;
			const m = L.map(mapEl, { zoomControl: false }).setView([origin.lat, origin.lng], 12);
			L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution: '&copy; OpenStreetMap',
				maxZoom: 19
			}).addTo(m);
			const breweries = [data!.featured, ...data!.nearby].filter((b) => b.coordinates);
			for (const b of breweries) {
				if (!b.coordinates) continue;
				const marker = L.marker([b.coordinates.lat, b.coordinates.lng]).addTo(m);
				marker.on('click', () => (selected = b));
			}
			map = m;
		});
	});

	async function loadLeaflet() {
		if (leaflet) return;
		// @ts-expect-error window.L is injected at runtime by the Leaflet CDN script
		if (window.L) {
			// @ts-expect-error window.L is injected at runtime by the Leaflet CDN script
			leaflet = window.L;
			return;
		}
		await loadScript('https://unpkg.com/leaflet@1.9.4/dist/leaflet.js');
		await loadCss('https://unpkg.com/leaflet@1.9.4/dist/leaflet.css');
		// @ts-expect-error window.L is injected at runtime by the Leaflet CDN script
		leaflet = window.L;
	}

	function loadScript(src: string) {
		return new Promise<void>((res, rej) => {
			const s = document.createElement('script');
			s.src = src;
			s.onload = () => res();
			s.onerror = () => rej();
			document.head.appendChild(s);
		});
	}
	function loadCss(href: string) {
		return new Promise<void>((res) => {
			const l = document.createElement('link');
			l.rel = 'stylesheet';
			l.href = href;
			l.onload = () => res();
			document.head.appendChild(l);
		});
	}

	const hrefFor = (b: Brewery) =>
		`/brewery/${b.id}?lat=${origin.lat}&lng=${origin.lng}&unit=${unit}`;
</script>

<svelte:head><title>{m.app_name()} · {m.map_title()}</title></svelte:head>

<section class="px-4 pt-6 pb-4">
	<header class="mb-3">
		<h1 class="font-semibold text-[var(--color-slate)] text-[var(--text-h1)]">{m.map_title()}</h1>
		<p class="text-[var(--color-muted)] text-[var(--text-sm)]">{m.map_nearby()}</p>
	</header>
</section>

<div class="relative h-[calc(100dvh-9rem)] w-full">
	{#if loading}
		<div class="p-4"><Skeleton lines={3} /></div>
	{:else if !data || [data.featured, ...data.nearby].filter((b) => b.coordinates).length === 0}
		<EmptyState icon="map" title={m.search_empty()} />
	{:else}
		<div
			bind:this={mapEl}
			class="h-full w-full bg-[var(--color-cream-200)]"
			aria-label={m.map_title()}
		></div>
	{/if}
</div>

<BottomSheet open={selected !== null} onclose={() => (selected = null)} title={selected?.name}>
	{#if selected}
		<div class="space-y-4">
			<div
				class="aspect-[16/9] overflow-hidden rounded-[var(--radius-card)] bg-[var(--color-cream-200)]"
			>
				<div
					class="flex h-full w-full items-center justify-center bg-gradient-to-br from-[var(--color-hop-100)] to-[var(--color-amber-300)] text-[var(--color-hop-500)]"
				>
					<Icon name="compass" size={40} />
				</div>
			</div>
			<div>
				<p class="text-[var(--color-muted)] text-[var(--text-sm)]">
					{typeLabel(selected.breweryType)}
				</p>
				{#if selected.city}<p class="text-[var(--color-slate-faint)] text-[var(--text-sm)]">
						{selected.city}
					</p>{/if}
				{#if selected.distanceMeters !== undefined}
					<p class="mt-1 font-medium text-[var(--color-hop-600)] text-[var(--text-base)]">
						{formatDistance(selected.distanceMeters, unit)}
					</p>
				{/if}
			</div>
			<Button href={hrefFor(selected)}>{m.detail_directions()}</Button>
		</div>
	{/if}
</BottomSheet>
