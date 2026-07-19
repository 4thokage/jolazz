<script lang="ts">
	import { page } from '$app/state';
	import { m } from '$lib/paraglide/messages';
	import { fetchBrewery } from '$lib/api';
	import { appState } from '$lib/app-state.svelte';
	import { link } from '$lib/link';
	import { passport } from '$lib/passport/store.svelte';
	import type { Brewery } from '$lib/types';
	import {
		formatAddress,
		formatDistance,
		mapsDirectionsUrl,
		typeLabel,
		displayPhone
	} from '$lib/format';
	import Icon from '$lib/components/Icon.svelte';
	import Button from '$lib/components/Button.svelte';
	import Skeleton from '$lib/components/Skeleton.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';
	import ErrorState from '$lib/components/ErrorState.svelte';

	const id = $derived(page.params.id ?? '');
	const params = $derived(page.url.searchParams);
	const origin = $derived({
		lat: Number(params.get('lat') ?? appState.origin.lat),
		lng: Number(params.get('lng') ?? appState.origin.lng)
	});
	const unit = $derived((params.get('unit') as 'km' | 'mi') ?? appState.unit);

	let brewery = $state<Brewery | null>(null);
	let loading = $state(true);
	let error = $state(false);

	$effect(() => {
		let cancelled = false;
		loading = true;
		error = false;
		fetchBrewery(id, origin, unit)
			.then((r) => {
				if (!cancelled) brewery = r.brewery;
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

	const favorited = $derived(brewery ? passport.isFavorite(brewery.id) : false);
	const stamped = $derived(brewery ? passport.isStamped(brewery.id) : false);

	const amenityRows = $derived(
		brewery
			? [
					brewery.takeaway !== undefined && {
						icon: 'food' as const,
						label: 'Takeaway',
						on: brewery.takeaway
					},
					brewery.taproom !== undefined && {
						icon: 'compass' as const,
						label: 'Taproom',
						on: brewery.taproom
					},
					brewery.foodAvailable !== undefined && {
						icon: 'food' as const,
						label: 'Food available',
						on: brewery.foodAvailable
					},
					brewery.dogFriendly !== undefined && {
						icon: 'dog' as const,
						label: 'Dog friendly',
						on: brewery.dogFriendly
					},
					brewery.wheelchairAccessible !== undefined && {
						icon: 'wheelchair' as const,
						label: 'Accessible',
						on: brewery.wheelchairAccessible
					}
				].filter(
					(
						x
					): x is { icon: 'food' | 'compass' | 'dog' | 'wheelchair'; label: string; on: boolean } =>
						Boolean(x)
				)
			: []
	);
</script>

<svelte:head
	><title>{brewery ? brewery.name + ' · ' + m.app_name() : m.app_name()}</title></svelte:head
>

<section class="pb-8">
	{#if loading}
		<div class="aspect-[16/10] w-full bg-[var(--color-cream-200)]"></div>
		<div class="space-y-3 p-5"><Skeleton lines={5} /></div>
	{:else if error || !brewery}
		<ErrorState title={m.error_title()}>
			<Button onclick={() => location.reload()}>{m.error_retry()}</Button>
		</ErrorState>
	{:else}
		<div class="relative aspect-[16/10] w-full overflow-hidden bg-[var(--color-cream-200)]">
			{#if brewery.photos && brewery.photos.length}
				<img src={brewery.photos[0]} alt={brewery.name} class="h-full w-full object-cover" />
			{:else}
				<div
					class="flex h-full w-full items-center justify-center bg-gradient-to-br from-[var(--color-hop-100)] to-[var(--color-amber-300)] text-[var(--color-hop-500)]"
				>
					<Icon name="compass" size={56} />
				</div>
			{/if}
			<a
				href={link(`/explore?lat=${origin.lat}&lng=${origin.lng}&unit=${unit}`)}
				class="absolute top-4 left-4 grid h-10 w-10 place-items-center rounded-full bg-[var(--color-card)]/90 text-[var(--color-slate)] shadow-[var(--shadow-card)] backdrop-blur focus-visible:ring-2 focus-visible:ring-[var(--color-copper-400)] focus-visible:outline-none"
				aria-label="Back"
			>
				<Icon name="chevron-right" size={22} />
			</a>
		</div>

		<div class="px-5 pt-5">
			<div class="flex items-start justify-between gap-3">
				<div class="min-w-0">
					<h1 class="font-semibold text-[var(--color-slate)] text-[var(--text-h1)]">
						{brewery.name}
					</h1>
					<p class="mt-1 text-[var(--color-muted)] text-[var(--text-base)]">
						{typeLabel(brewery.breweryType)}
					</p>
				</div>
				<button
					type="button"
					onclick={() => brewery && passport.toggleFavorite(brewery.id)}
					aria-pressed={favorited}
					aria-label={favorited ? m.detail_saved() : m.detail_save()}
					class="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[var(--color-line)] bg-[var(--color-card)] text-[var(--color-slate-soft)] shadow-[var(--shadow-card)] hover:text-[var(--color-copper-500)] focus-visible:ring-2 focus-visible:ring-[var(--color-copper-400)] focus-visible:outline-none {favorited
						? 'text-[var(--color-copper-500)]'
						: ''}"
				>
					<Icon name="bookmark" size={22} />
				</button>
			</div>

			{#if brewery.distanceMeters !== undefined}
				<p class="mt-2 font-medium text-[var(--color-hop-600)] text-[var(--text-sm)]">
					{formatDistance(brewery.distanceMeters, unit)} · {formatAddress(brewery) || brewery.city}
				</p>
			{/if}

			{#if brewery.description}
				<p class="mt-4 leading-relaxed text-[var(--color-slate)] text-[var(--text-base)]">
					{brewery.description}
				</p>
			{/if}

			<div class="mt-5 flex gap-3">
				<Button href={mapsDirectionsUrl(brewery)} class="flex-1">{m.detail_directions()}</Button>
				<Button
					variant={stamped ? 'secondary' : 'primary'}
					onclick={() => brewery && passport.toggleStamp(brewery.id)}
					class="flex-1"
				>
					<Icon name="star" size={18} />
					{stamped ? m.detail_stamped() : m.detail_stamp()}
				</Button>
			</div>

			<div class="mt-6 space-y-1">
				{#if brewery.website}
					<a
						href={link(brewery.website ?? '#')}
						target="_blank"
						rel="noreferrer"
						class="flex items-center gap-3 rounded-xl px-2 py-3 text-[var(--color-hop-700)] text-[var(--text-base)] hover:bg-[var(--color-cream-200)]"
					>
						<Icon name="globe" size={22} /><span>{m.detail_website()}</span>
					</a>
				{/if}
				{#if brewery.instagram}
					<a
						href={link(brewery.instagram ?? '#')}
						target="_blank"
						rel="noreferrer"
						class="flex items-center gap-3 rounded-xl px-2 py-3 text-[var(--color-hop-700)] text-[var(--text-base)] hover:bg-[var(--color-cream-200)]"
					>
						<Icon name="instagram" size={22} /><span>{m.detail_instagram()}</span>
					</a>
				{/if}
				{#if brewery.phone}
					<a
						href="tel:{brewery.phone}"
						class="flex items-center gap-3 rounded-xl px-2 py-3 text-[var(--color-hop-700)] text-[var(--text-base)] hover:bg-[var(--color-cream-200)]"
					>
						<Icon name="phone" size={22} /><span>{displayPhone(brewery.phone)}</span>
					</a>
				{/if}
			</div>

			<div class="mt-6">
				<h2 class="mb-1 font-semibold text-[var(--color-slate)] text-[var(--text-h2)]">
					{m.detail_beers()}
				</h2>
				{#if brewery.beers && brewery.beers.length}
					<ul class="divide-y divide-[var(--color-line)]">
						{#each brewery.beers as beer (beer.id)}
							<li class="flex items-center justify-between py-3">
								<span class="font-medium text-[var(--color-slate)]">{beer.name}</span>
								<span class="text-[var(--color-muted)] text-[var(--text-sm)]"
									>{beer.style} · {beer.abv}%</span
								>
							</li>
						{/each}
					</ul>
				{:else}
					<EmptyState
						icon="compass"
						title={m.detail_beers_empty()}
						description={m.detail_beers_empty_desc()}
					/>
				{/if}
			</div>

			<div class="mt-6">
				<h2
					class="mb-2 flex items-center gap-2 font-semibold text-[var(--color-slate)] text-[var(--text-h2)]"
				>
					<Icon name="clock" size={20} /><span>{m.detail_hours()}</span>
				</h2>
				{#if brewery.openingHours}
					<p class="text-[var(--color-slate)] text-[var(--text-base)]">{brewery.openingHours}</p>
				{:else}
					<p class="text-[var(--color-muted)] text-[var(--text-sm)]">{m.detail_hours_empty()}</p>
				{/if}
			</div>

			<div class="mt-6">
				<h2 class="mb-2 font-semibold text-[var(--color-slate)] text-[var(--text-h2)]">
					{m.detail_events()}
				</h2>
				{#if brewery.events && brewery.events.length}
					<ul class="space-y-3">
						{#each brewery.events as ev (ev.id)}
							<li class="rounded-[var(--radius-card)] border border-[var(--color-line)] p-4">
								<p class="font-semibold text-[var(--color-slate)]">{ev.title}</p>
								{#if ev.date}<p class="text-[var(--color-muted)] text-[var(--text-sm)]">
										{ev.date}
									</p>{/if}
								{#if ev.description}<p
										class="mt-1 text-[var(--color-slate-soft)] text-[var(--text-sm)]"
									>
										{ev.description}
									</p>{/if}
							</li>
						{/each}
					</ul>
				{:else}
					<EmptyState icon="spark" title={m.detail_events_empty()} />
				{/if}
			</div>

			{#if amenityRows.length > 0}
				<div class="mt-6">
					<h2 class="mb-2 font-semibold text-[var(--color-slate)] text-[var(--text-h2)]">
						{m.detail_amenities()}
					</h2>
					<div class="grid grid-cols-2 gap-2">
						{#each amenityRows as row (row.label)}
							<div
								class="flex items-center gap-2 rounded-xl border border-[var(--color-line)] px-3 py-3 text-[var(--text-sm)] {row.on
									? 'text-[var(--color-slate)]'
									: 'text-[var(--color-slate-faint)] line-through'}"
							>
								<Icon name={row.icon} size={18} />
								<span>{row.label}</span>
							</div>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	{/if}
</section>
