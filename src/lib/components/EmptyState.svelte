<script lang="ts">
	import type { Snippet } from 'svelte';
	import Icon from './Icon.svelte';

	/* Hallmark · component: empty-state · illustrated scene, encouraging, never generic.
	 * Scenes replace the old flat icon-in-circle with composed craft-beer
	 * illustrations (tasting glasses, hops + calendar, camera) so empty states
	 * read as intentional, premium moments — not dead ends. */
	interface Props {
		icon?: 'compass' | 'bookmark' | 'star' | 'search' | 'map' | 'spark' | 'camera' | 'globe';
		title: string;
		description?: string;
		children?: Snippet;
	}
	let { icon = 'compass', title, description, children }: Props = $props();
</script>

<div class="flex flex-col items-center px-6 py-12 text-center">
	<div class="relative mb-6" aria-hidden="true">
		{#if icon === 'spark'}
			<!-- Event empty state: calendar + hops -->
			<svg viewBox="0 0 120 120" class="h-32 w-32 drop-shadow-[var(--shadow-card)]">
				<rect
					x="22"
					y="34"
					width="76"
					height="68"
					rx="14"
					fill="var(--color-card)"
					stroke="var(--color-line)"
					stroke-width="2.5"
				/>
				<rect x="22" y="34" width="76" height="20" rx="14" fill="var(--color-hop-600)" />
				<line
					x1="36"
					y1="26"
					x2="36"
					y2="42"
					stroke="var(--color-hop-600)"
					stroke-width="4"
					stroke-linecap="round"
				/>
				<line
					x1="84"
					y1="26"
					x2="84"
					y2="42"
					stroke="var(--color-hop-600)"
					stroke-width="4"
					stroke-linecap="round"
				/>
				<g fill="var(--color-amber-400)">
					<circle cx="40" cy="68" r="4.5" />
					<circle cx="56" cy="68" r="4.5" />
					<circle cx="72" cy="68" r="4.5" />
					<circle cx="40" cy="84" r="4.5" />
					<circle cx="56" cy="84" r="4.5" />
					<circle cx="72" cy="84" r="4.5" />
				</g>
				<path d="M88 78c8-10 4-22-2-26 0 10-4 18-10 22 4 6 8 6 12 4z" fill="var(--color-hop-400)" />
				<path d="M86 80c6-8 4-17-1-20 1 8-2 14-6 17 3 4 5 4 7 3z" fill="var(--color-hop-300)" />
			</svg>
		{:else if icon === 'camera'}
			<!-- Photos empty state: camera -->
			<svg viewBox="0 0 120 120" class="h-32 w-32 drop-shadow-[var(--shadow-card)]">
				<rect
					x="20"
					y="44"
					width="80"
					height="56"
					rx="16"
					fill="var(--color-card)"
					stroke="var(--color-line)"
					stroke-width="2.5"
				/>
				<path d="M44 44l6-10h20l6 10z" fill="var(--color-hop-500)" />
				<circle
					cx="60"
					cy="72"
					r="18"
					fill="var(--color-cream-200)"
					stroke="var(--color-hop-400)"
					stroke-width="2.5"
				/>
				<circle cx="60" cy="72" r="9" fill="var(--color-amber-400)" />
				<circle cx="84" cy="56" r="3.5" fill="var(--color-amber-300)" />
			</svg>
		{:else if icon === 'search'}
			<!-- No results: compass in a soft disc -->
			<div
				class="grid h-28 w-28 place-items-center rounded-full bg-[var(--color-cream-200)] shadow-[var(--shadow-card)]"
			>
				<span class="text-[var(--color-hop-500)]"><Icon name="search" size={48} /></span>
			</div>
		{:else if icon === 'bookmark' || icon === 'star'}
			<!-- Favorites: soft disc + icon -->
			<div
				class="grid h-28 w-28 place-items-center rounded-full bg-[var(--color-cream-200)] shadow-[var(--shadow-card)]"
			>
				<span class="text-[var(--color-copper-500)]"><Icon name={icon} size={48} /></span>
			</div>
		{:else}
			<!-- Generic: tasting glasses scene -->
			<svg viewBox="0 0 120 120" class="h-32 w-32 drop-shadow-[var(--shadow-card)]">
				<ellipse cx="60" cy="104" rx="40" ry="7" fill="var(--color-cream-200)" />
				<path d="M40 40h12v34a6 6 0 0 1-12 0z" fill="var(--color-amber-400)" />
				<path d="M54 40h12v34a6 6 0 0 1-12 0z" fill="var(--color-amber-300)" />
				<path d="M68 40h12v34a6 6 0 0 1-12 0z" fill="var(--color-hop-400)" />
				<rect
					x="36"
					y="36"
					width="48"
					height="8"
					rx="4"
					fill="var(--color-card)"
					stroke="var(--color-line)"
					stroke-width="2"
				/>
				<path
					d="M40 30c2-6 6-6 8 0M54 30c2-6 6-6 8 0M68 30c2-6 6-6 8 0"
					stroke="var(--color-hop-300)"
					stroke-width="2.5"
					fill="none"
					stroke-linecap="round"
				/>
			</svg>
		{/if}
	</div>

	<h3 class="font-semibold text-[var(--color-slate)] text-[var(--text-h2)]">{title}</h3>
	{#if description}
		<p class="mt-2 max-w-xs leading-relaxed text-[var(--color-muted)] text-[var(--text-sm)]">
			{description}
		</p>
	{/if}
	{#if children}
		<div class="mt-5">{@render children()}</div>
	{/if}
</div>
