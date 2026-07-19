<script lang="ts">
	import type { Brewery, DistanceUnit } from '$lib/types';
	import { formatDistance, typeLabel } from '$lib/format';
	import Icon from './Icon.svelte';
	import { passport } from '$lib/passport/store.svelte';
	import { link } from '$lib/link';

	interface Props {
		brewery: Brewery;
		unit: DistanceUnit;
		origin: { lat: number; lng: number };
	}
	let { brewery, unit, origin }: Props = $props();

	const favorited = $derived(passport.isFavorite(brewery.id));
	const href = $derived(
		link(`/brewery/${brewery.id}?lat=${origin.lat}&lng=${origin.lng}&unit=${unit}`)
	);
</script>

<article
	class="group relative overflow-hidden rounded-[var(--radius-card)] bg-[var(--color-card)] shadow-[var(--shadow-card)] transition-transform duration-[var(--dur-fast)] ease-[var(--ease-out)] active:translate-y-px"
>
	<a {href} class="block min-h-11">
		<div class="relative aspect-[16/10] w-full overflow-hidden bg-[var(--color-cream-200)]">
			{#if brewery.photos && brewery.photos.length}
				<img
					src={brewery.photos[0]}
					alt={brewery.name}
					class="h-full w-full object-cover"
					loading="lazy"
				/>
			{:else}
				<div
					class="flex h-full w-full items-center justify-center bg-gradient-to-br from-[var(--color-hop-100)] to-[var(--color-amber-300)]"
					aria-hidden="true"
				>
					<Icon name="compass" size={40} />
				</div>
			{/if}

			<button
				type="button"
				onclick={() => passport.toggleFavorite(brewery.id)}
				aria-label={favorited ? 'Remove from favorites' : 'Save to favorites'}
				aria-pressed={favorited}
				class="absolute top-3 right-3 grid h-10 w-10 place-items-center rounded-full bg-[var(--color-card)]/90 text-[var(--color-slate)] shadow-[var(--shadow-card)] backdrop-blur transition-colors hover:text-[var(--color-copper-500)] focus-visible:ring-2 focus-visible:ring-[var(--color-copper-400)] focus-visible:outline-none {favorited
					? 'text-[var(--color-copper-500)]'
					: ''}"
			>
				<Icon name="bookmark" size={20} />
			</button>

			{#if brewery.distanceMeters !== undefined}
				<span
					class="absolute bottom-3 left-3 rounded-full bg-[var(--color-card)]/90 px-3 py-1 font-medium text-[var(--color-slate)] text-[var(--text-xs)] shadow-[var(--shadow-card)] backdrop-blur"
				>
					{formatDistance(brewery.distanceMeters, unit)}
				</span>
			{/if}
		</div>

		<div class="p-4">
			<div class="flex items-start justify-between gap-3">
				<h3 class="leading-tight font-semibold text-[var(--text-h2)]">{brewery.name}</h3>
			</div>
			<p class="mt-1 text-[var(--color-muted)] text-[var(--text-sm)]">
				{typeLabel(brewery.breweryType)}
			</p>
			{#if brewery.city}
				<p class="mt-0.5 text-[var(--color-slate-faint)] text-[var(--text-sm)]">{brewery.city}</p>
			{/if}
		</div>
	</a>
</article>
