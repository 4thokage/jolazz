<script lang="ts">
	import { page } from '$app/state';
	import { m } from '$lib/paraglide/messages';
	import { fetchExplore } from '$lib/api';
	import { appState } from '$lib/app-state.svelte';
	import { link } from '$lib/link';
	import type { Brewery, ExploreResult } from '$lib/types';
	import { formatDistance } from '$lib/format';
	import Icon from '$lib/components/Icon.svelte';
	import BreweryCard from '$lib/components/BreweryCard.svelte';
	import Button from '$lib/components/Button.svelte';
	import Skeleton from '$lib/components/Skeleton.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';
	import ErrorState from '$lib/components/ErrorState.svelte';
	import FilterSheet from '$lib/components/FilterSheet.svelte';

	const params = $derived(page.url.searchParams);
	const origin = $derived({
		lat: Number(params.get('lat') ?? appState.origin.lat),
		lng: Number(params.get('lng') ?? appState.origin.lng)
	});
	const unit = $derived((params.get('unit') as 'km' | 'mi') ?? appState.unit);

	let data = $state<ExploreResult | null>(null);
	let error = $state(false);
	let loading = $state(true);
	let filtersOpen = $state(false);
	let draftFilters = $state(appState.filters);

	$effect(() => {
		appState.setUnit(unit);
		let cancelled = false;
		loading = true;
		error = false;
		const f = appState.filters;
		const extra: Record<string, string> = {};
		for (const [k, v] of Object.entries(f)) {
			if (v === true) extra[k] = 'true';
		}
		if (f.maxDistanceMeters) extra.maxDistanceKm = String(f.maxDistanceMeters / 1000);
		fetchExplore(origin, unit, Object.keys(extra).length ? extra : undefined)
			.then((r) => {
				if (!cancelled) data = r;
			})
			.catch(() => {
				if (!cancelled) error = true;
			})
			.finally(() => {
				if (!cancelled) loading = false;
			});
		return () => {
			cancelled = true;
		};
	});

	const hrefFor = (b: Brewery) =>
		link(`/brewery/${b.id}?lat=${origin.lat}&lng=${origin.lng}&unit=${unit}`);
	const activeFilterCount = $derived(Object.keys(appState.filters).length);

	function applyFilters() {
		appState.filters = draftFilters;
	}
</script>

<svelte:head><title>{m.app_name()} · {m.explore_title()}</title></svelte:head>

<section class="px-4 pt-6 pb-4">
	<header class="mb-4 flex items-center justify-between">
		<div>
			<p class="text-[var(--color-muted)] text-[var(--text-sm)]">{m.app_name()}</p>
			<h1 class="font-semibold text-[var(--color-slate)] text-[var(--text-h1)]">
				{m.explore_title()}
			</h1>
		</div>
		<div class="flex items-center gap-2">
			<a
				href={link(`/settings?lat=${origin.lat}&lng=${origin.lng}&unit=${unit}`)}
				aria-label={m.settings_title()}
				class="grid h-11 w-11 place-items-center rounded-full border border-[var(--color-line)] bg-[var(--color-card)] text-[var(--color-slate-soft)] shadow-[var(--shadow-card)] focus-visible:ring-2 focus-visible:ring-[var(--color-copper-400)] focus-visible:outline-none"
			>
				<Icon name="settings" size={22} />
			</a>
			<button
				type="button"
				onclick={() => (filtersOpen = true)}
				aria-label={m.explore_filters()}
				class="relative grid h-11 w-11 place-items-center rounded-full border border-[var(--color-line)] bg-[var(--color-card)] text-[var(--color-slate-soft)] shadow-[var(--shadow-card)] focus-visible:ring-2 focus-visible:ring-[var(--color-copper-400)] focus-visible:outline-none"
			>
				<Icon name="filter" size={22} />
				{#if activeFilterCount > 0}
					<span
						class="absolute -top-0.5 -right-0.5 grid h-5 w-5 place-items-center rounded-full bg-[var(--color-copper-500)] font-semibold text-[var(--text-xs)] text-white"
					>
						{activeFilterCount}
					</span>
				{/if}
			</button>
		</div>
	</header>

	{#if loading}
		<div class="space-y-4">
			<div class="mb-2"><Skeleton lines={2} /></div>
			{#each Array(4) as _, i (i)}<Skeleton />{/each}
		</div>
	{:else if error}
		<ErrorState title={m.error_title()} message="">
			<Button onclick={() => location.reload()}>{m.error_retry()}</Button>
		</ErrorState>
	{:else if data}
		{#if data.featured}
			{@const b = data.featured}
			<a
				href={hrefFor(b)}
				class="relative mb-4 block overflow-hidden rounded-[var(--radius-card)] bg-[var(--color-hop-600)] text-white shadow-[var(--shadow-card)]"
			>
				<div
					class="flex aspect-[16/7] items-end bg-gradient-to-br from-[var(--color-hop-500)] to-[var(--color-amber-500)] p-5"
				>
					<div class="relative z-10">
						<p class="tracking-wide text-[var(--text-xs)] text-white/80 uppercase">
							{m.explore_featured()}
						</p>
						<h2 class="mt-1 font-semibold text-[var(--text-h1)]">{b.name}</h2>
						<p class="mt-1 text-[var(--text-sm)] text-white/85">{b.city}</p>
					</div>
				</div>
				{#if b.distanceMeters !== undefined}
					<span
						class="absolute top-4 right-4 rounded-full bg-white/20 px-3 py-1 font-medium text-[var(--text-xs)] backdrop-blur"
					>
						{formatDistance(b.distanceMeters, unit)}
					</span>
				{/if}
			</a>
		{/if}

		{#if !data.hasEventsToday}
			<div class="mb-4">
				<p
					class="mb-2 font-semibold tracking-wide text-[var(--color-slate-faint)] text-[var(--text-sm)] uppercase"
				>
					{m.explore_upcoming()}
				</p>
				<EmptyState icon="spark" title={m.detail_events_empty()} />
			</div>
		{/if}

		<h2 class="mb-3 font-semibold text-[var(--color-slate)] text-[var(--text-h2)]">
			{m.map_nearby()}
		</h2>
		{#if data.nearby.length === 0}
			<EmptyState icon="compass" title={m.search_empty()} />
		{:else}
			<div class="grid grid-cols-1 gap-4">
				{#each data.nearby as b (b.id)}
					<BreweryCard brewery={b} {unit} {origin} />
				{/each}
			</div>
		{/if}
	{/if}
</section>

<FilterSheet
	open={filtersOpen}
	onclose={() => (filtersOpen = false)}
	filters={draftFilters}
	onchange={(f) => (draftFilters = f)}
	onapply={applyFilters}
/>
