<script lang="ts">
	import type { Brewery, DistanceUnit } from '$lib/types';
	import { formatDistance, typeLabel } from '$lib/format';
	import Icon from './Icon.svelte';
	import { passport } from '$lib/passport/store.svelte';
	import { link } from '$lib/link';
	import { cardPhoto } from '$lib/atmosphere';

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
			<img
				src={cardPhoto(brewery)}
				alt=""
				class="h-full w-full object-cover transition-transform duration-[600ms] ease-[var(--ease-out)] group-hover:scale-[1.04]"
				loading="lazy"
			/>
			<div
				class="pointer-events-none absolute inset-0 bg-gradient-to-t from-[oklch(20%_0.04_150_/_0.72)] via-[oklch(20%_0.04_150_/_0.12)] to-transparent"
				aria-hidden="true"
			></div>

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
					class="absolute bottom-3 left-3 grid place-items-center rounded-full bg-[var(--color-card)]/92 px-3 py-1 font-semibold text-[var(--color-slate)] text-[var(--text-xs)] shadow-[var(--shadow-card)] backdrop-blur"
				>
					<Icon name="pin" size={13} class="mr-1 opacity-70" />
					{formatDistance(brewery.distanceMeters, unit)}
				</span>
			{/if}
		</div>

		<div class="flex items-start justify-between gap-3 p-4">
			<div class="min-w-0">
				<h3 class="truncate font-semibold text-[var(--color-slate)] text-[var(--text-h2)]">
					{brewery.name}
				</h3>
				<p class="mt-1 text-[var(--color-muted)] text-[var(--text-sm)]">
					{typeLabel(brewery.breweryType)}
				</p>
				{#if brewery.city}
					<p class="mt-0.5 text-[var(--color-slate-faint)] text-[var(--text-sm)]">
						{brewery.city}
					</p>
				{/if}
			</div>
		</div>
	</a>
</article>
