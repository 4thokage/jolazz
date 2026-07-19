<script lang="ts">
	import { page } from '$app/state';
	import { m } from '$lib/paraglide/messages';
	import { fetchBreweriesByIds } from '$lib/api';
	import { appState } from '$lib/app-state.svelte';
	import { passport } from '$lib/passport/store.svelte';
	import type { Brewery } from '$lib/types';
	import BreweryCard from '$lib/components/BreweryCard.svelte';
	import Skeleton from '$lib/components/Skeleton.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';
	import StampBadge from '$lib/components/StampBadge.svelte';
	import { link } from '$lib/link';

	const params = $derived(page.url.searchParams);
	const origin = $derived({
		lat: Number(params.get('lat') ?? appState.origin.lat),
		lng: Number(params.get('lng') ?? appState.origin.lng)
	});
	const unit = $derived((params.get('unit') as 'km' | 'mi') ?? appState.unit);

	type Tab = 'saved' | 'passport';
	let tab = $state<Tab>('saved');

	let saved = $state<Brewery[]>([]);
	let stamped = $state<Brewery[]>([]);
	let loading = $state(true);

	$effect(() => {
		let cancelled = false;
		loading = true;
		Promise.all([
			fetchBreweriesByIds([...passport.favorites], origin, unit),
			fetchBreweriesByIds([...passport.stamps], origin, unit)
		])
			.then(([s, p]) => {
				if (cancelled) return;
				saved = s.results;
				stamped = p.results;
			})
			.catch(() => {})
			.finally(() => {
				if (!cancelled) loading = false;
			});
		return () => {
			cancelled = true;
		};
	});

	const hrefFor = (b: Brewery) =>
		link(`/brewery/${b.id}?lat=${origin.lat}&lng=${origin.lng}&unit=${unit}`);
</script>

<svelte:head><title>{m.app_name()} · {m.favorites_title()}</title></svelte:head>

<section class="px-4 pt-6 pb-4">
	<header class="mb-5">
		<p class="text-[var(--color-muted)] text-[var(--text-sm)]">{m.app_name()}</p>
		<h1 class="font-semibold text-[var(--color-slate)] text-[var(--text-h1)]">
			{m.favorites_title()}
		</h1>
		<p class="mt-1 text-[var(--color-muted)] text-[var(--text-base)]">
			{m.favorites_saved()}
		</p>
	</header>

	<div class="mb-5 flex gap-2" role="tablist">
		<button
			role="tab"
			aria-selected={tab === 'saved'}
			onclick={() => (tab = 'saved')}
			class="flex-1 rounded-full px-4 py-3 font-medium text-[var(--text-base)] transition-colors focus-visible:ring-2 focus-visible:ring-[var(--color-copper-400)] focus-visible:outline-none {tab ===
			'saved'
				? 'bg-[var(--color-hop-600)] text-white'
				: 'bg-[var(--color-cream-200)] text-[var(--color-slate-soft)]'}"
		>
			{m.favorites_saved()}
		</button>
		<button
			role="tab"
			aria-selected={tab === 'passport'}
			onclick={() => (tab = 'passport')}
			class="flex-1 rounded-full px-4 py-3 font-medium text-[var(--text-base)] transition-colors focus-visible:ring-2 focus-visible:ring-[var(--color-copper-400)] focus-visible:outline-none {tab ===
			'passport'
				? 'bg-[var(--color-copper-500)] text-white'
				: 'bg-[var(--color-cream-200)] text-[var(--color-slate-soft)]'}"
		>
			{m.favorites_passport()}
		</button>
	</div>

	{#if loading}
		<div class="grid grid-cols-1 gap-4">
			{#each Array(3) as _, i (i)}<Skeleton />{/each}
		</div>
	{:else if tab === 'saved'}
		{#if saved.length === 0}
			<EmptyState icon="bookmark" title={m.favorites_none()} description={m.favorites_none_desc()}>
				<a
					href={link(`/explore?lat=${origin.lat}&lng=${origin.lng}&unit=${unit}`)}
					class="font-medium text-[var(--color-copper-500)]"
				>
					{m.explore_title()} →
				</a>
			</EmptyState>
		{:else}
			<div class="grid grid-cols-1 gap-4">
				{#each saved as b (b.id)}<BreweryCard brewery={b} {unit} {origin} />{/each}
			</div>
		{/if}
	{:else}
		{#if stamped.length === 0}
			<EmptyState icon="star" title={m.passport_empty()} description={m.passport_empty_desc()} />
		{:else}
			<div class="grid grid-cols-3 gap-3 sm:grid-cols-4">
				{#each stamped as b (b.id)}
					<a
						href={hrefFor(b)}
						class="flex flex-col items-center gap-2 rounded-[var(--radius-card)] p-2 hover:bg-[var(--color-cream-200)]"
					>
						<StampBadge stamped={true} size={64} label={b.name} />
					</a>
				{/each}
			</div>
		{/if}
	{/if}
</section>
