<script lang="ts">
	import type { Snippet } from 'svelte';
	import Icon from './Icon.svelte';

	/* Hallmark · component: empty-state · illustrated, encouraging, never generic. */
	interface Props {
		icon?: 'compass' | 'bookmark' | 'star' | 'search' | 'map' | 'spark';
		title: string;
		description?: string;
		children?: Snippet;
	}
	let { icon = 'compass', title, description, children }: Props = $props();
</script>

<div class="flex flex-col items-center px-6 py-12 text-center">
	<div class="relative mb-5 grid h-24 w-24 place-items-center" aria-hidden="true">
		<svg
			viewBox="0 0 96 96"
			class="absolute inset-0 text-[var(--color-hop-100)]"
			fill="currentColor"
		>
			<circle cx="48" cy="48" r="46" />
		</svg>
		<span class="relative text-[var(--color-hop-500)]"><Icon name={icon} size={36} /></span>
	</div>
	<h3 class="font-semibold text-[var(--color-slate)] text-[var(--text-h2)]">{title}</h3>
	{#if description}
		<p class="mt-2 max-w-xs text-[var(--color-muted)] text-[var(--text-sm)]">{description}</p>
	{/if}
	{#if children}
		<div class="mt-5">{@render children()}</div>
	{/if}
</div>
