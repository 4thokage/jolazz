<script lang="ts">
	import { page } from '$app/state';
	import { m } from '$lib/paraglide/messages';
	import { fetchSearch, fetchBreweriesByIds } from '$lib/api';
	import { appState } from '$lib/app-state.svelte';
	import { passport } from '$lib/passport/store.svelte';
	import type { Brewery } from '$lib/types';
	import SearchBar from '$lib/components/SearchBar.svelte';
	import BreweryCard from '$lib/components/BreweryCard.svelte';
	import Skeleton from '$lib/components/Skeleton.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';
	import Icon from '$lib/components/Icon.svelte';

	const params = $derived(page.url.searchParams);
	const origin = $derived({
		lat: Number(params.get('lat') ?? appState.origin.lat),
		lng: Number(params.get('lng') ?? appState.origin.lng)
	});
	const unit = $derived((params.get('unit') as 'km' | 'mi') ?? appState.unit);

	let query = $state('');
	let results = $state<Brewery[] | null>(null);
	let loading = $state(false);
	let searched = $state(false);
	let popular = $state<Brewery[]>([]);
	let recentSearches = $derived([...passport.recentSearches]);

	let timer: ReturnType<typeof setTimeout>;
	function onInput(v: string) {
		query = v;
		searched = false;
		clearTimeout(timer);
		if (!v.trim()) {
			results = null;
			loading = false;
			return;
		}
		loading = true;
		timer = setTimeout(() => runSearch(v), 250);
	}

	async function runSearch(q: string) {
		loading = true;
		try {
			const r = await fetchSearch(q, origin, unit);
			results = r.results;
			searched = true;
			passport.addRecentSearch(q);
		} finally {
			loading = false;
		}
	}

	$effect(() => {
		fetchBreweriesByIds([], origin, unit); // noop warm
		fetchPopular();
	});

	async function fetchPopular() {
		// Use explore endpoint's nearby as "popular" proxy (deterministic, not a rating).
		const { fetchExplore } = await import('$lib/api');
		const r = await fetchExplore(origin, unit).catch(() => null);
		if (r) popular = [r.featured, ...r.nearby].slice(0, 6);
	}

	function submitRecent(term: string) {
		query = term;
		runSearch(term);
	}
</script>

<svelte:head><title>{m.app_name()} · {m.search_title()}</title></svelte:head>

<section class="px-4 pt-6 pb-4">
	<header class="mb-4">
		<h1 class="font-semibold text-[var(--color-slate)] text-[var(--text-h1)]">
			{m.search_title()}
		</h1>
	</header>

	<div class="mb-5">
		<SearchBar value={query} oninput={onInput} placeholder={m.search_placeholder()} />
	</div>

	{#if loading}
		<div class="grid grid-cols-1 gap-4">
			{#each Array(4) as _, i (i)}<Skeleton />{/each}
		</div>
	{:else if searched && results && results.length === 0}
		<EmptyState icon="search" title={m.search_empty()} />
	{:else if results && results.length > 0}
		<div class="grid grid-cols-1 gap-4">
			{#each results as b (b.id)}
				<BreweryCard brewery={b} {unit} {origin} />
			{/each}
		</div>
	{:else}
		{#if recentSearches.length > 0}
			<div class="mb-6">
				<div class="mb-2 flex items-center justify-between">
					<p
						class="font-semibold tracking-wide text-[var(--color-slate-faint)] text-[var(--text-sm)] uppercase"
					>
						{m.search_recent()}
					</p>
					<button
						type="button"
						onclick={() => passport.clearRecentSearches()}
						class="rounded font-medium text-[var(--color-copper-500)] text-[var(--text-sm)] focus-visible:ring-2 focus-visible:ring-[var(--color-copper-400)] focus-visible:outline-none"
					>
						{m.search_clear()}
					</button>
				</div>
				<div class="flex flex-wrap gap-2">
					{#each recentSearches as term (term)}
						<button
							type="button"
							onclick={() => submitRecent(term)}
							class="flex items-center gap-2 rounded-full border border-[var(--color-line)] bg-[var(--color-card)] px-4 py-2 text-[var(--color-slate-soft)] text-[var(--text-sm)] hover:border-[var(--color-hop-300)] focus-visible:ring-2 focus-visible:ring-[var(--color-copper-400)] focus-visible:outline-none"
						>
							<Icon name="search" size={16} />
							{term}
						</button>
					{/each}
				</div>
			</div>
		{/if}

		<div>
			<p
				class="mb-2 font-semibold tracking-wide text-[var(--color-slate-faint)] text-[var(--text-sm)] uppercase"
			>
				{m.search_popular()}
			</p>
			{#if popular.length === 0}
				<div class="grid grid-cols-1 gap-4">
					{#each Array(3) as _, i (i)}<Skeleton />{/each}
				</div>
			{:else}
				<div class="grid grid-cols-1 gap-4">
					{#each popular as b (b.id)}
						<BreweryCard brewery={b} {unit} {origin} />
					{/each}
				</div>
			{/if}
		</div>
	{/if}
</section>
