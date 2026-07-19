<script lang="ts">
	import { page } from '$app/state';
	import { m } from '$lib/paraglide/messages';
	import { fetchBreweriesByIds } from '$lib/api';
	import { appState } from '$lib/app-state.svelte';
	import { passport } from '$lib/passport/store.svelte';
	import { computeProgress } from '$lib/passport/progress';
	import type { Brewery } from '$lib/types';
	import StampBadge from '$lib/components/StampBadge.svelte';
	import Skeleton from '$lib/components/Skeleton.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';
	import { link } from '$lib/link';

	const params = $derived(page.url.searchParams);
	const origin = $derived({
		lat: Number(params.get('lat') ?? appState.origin.lat),
		lng: Number(params.get('lng') ?? appState.origin.lng)
	});
	const unit = $derived((params.get('unit') as 'km' | 'mi') ?? appState.unit);

	let stampedBreweries = $state<Brewery[]>([]);
	let loading = $state(true);

	$effect(() => {
		let cancelled = false;
		loading = true;
		fetchBreweriesByIds([...passport.stamps], origin, unit)
			.then((r) => {
				if (!cancelled) stampedBreweries = r.results;
			})
			.catch(() => {})
			.finally(() => {
				if (!cancelled) loading = false;
			});
		return () => {
			cancelled = true;
		};
	});

	const progress = $derived(computeProgress(passport.stamps, passport.favorites, stampedBreweries));
	const hrefFor = (b: Brewery) =>
		link(`/brewery/${b.id}?lat=${origin.lat}&lng=${origin.lng}&unit=${unit}`);
</script>

<svelte:head><title>{m.app_name()} · {m.passport_title()}</title></svelte:head>

<section class="px-4 pt-6 pb-4">
	<header class="mb-5">
		<h1 class="font-semibold text-[var(--color-slate)] text-[var(--text-h1)]">
			{m.passport_title()}
		</h1>
	</header>

	{#if loading}
		<div class="space-y-3"><Skeleton lines={4} /></div>
	{:else if progress.stampCount === 0}
		<EmptyState icon="star" title={m.passport_empty()} description={m.passport_empty_desc()} />
	{:else}
		<div class="mb-6 grid grid-cols-2 gap-3">
			<div
				class="rounded-[var(--radius-card)] bg-[var(--color-hop-600)] p-5 text-white shadow-[var(--shadow-card)]"
			>
				<p class="tracking-wide text-[var(--text-xs)] text-white/80 uppercase">
					{m.passport_stamps()}
				</p>
				<p class="mt-1 font-semibold text-[var(--text-display)]">{progress.stampCount}</p>
			</div>
			<div
				class="rounded-[var(--radius-card)] bg-[var(--color-amber-500)] p-5 text-[var(--color-copper-700)] shadow-[var(--shadow-card)]"
			>
				<p class="tracking-wide text-[var(--text-xs)] uppercase opacity-80">
					{m.passport_regions()}
				</p>
				<p class="mt-1 font-semibold text-[var(--text-display)]">{progress.distinctRegionCount}</p>
			</div>
		</div>

		{#if progress.regionsVisited.length > 0}
			<div class="mb-6 flex flex-wrap gap-2">
				{#each progress.regionsVisited as region (region)}
					<span
						class="rounded-full bg-[var(--color-cream-200)] px-3 py-1.5 text-[var(--color-slate-soft)] text-[var(--text-sm)]"
					>
						{region}
					</span>
				{/each}
			</div>
		{/if}

		<h2 class="mb-3 font-semibold text-[var(--color-slate)] text-[var(--text-h2)]">
			{m.favorites_passport()}
		</h2>
		<div class="grid grid-cols-3 gap-3 sm:grid-cols-4">
			{#each progress.recentStamps as b (b.id)}
				<a
					href={hrefFor(b)}
					class="flex flex-col items-center gap-2 rounded-[var(--radius-card)] p-2 hover:bg-[var(--color-cream-200)]"
				>
					<StampBadge stamped={true} size={64} label={b.name} />
				</a>
			{/each}
		</div>
	{/if}
</section>
