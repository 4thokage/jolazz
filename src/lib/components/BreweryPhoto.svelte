<script lang="ts">
	import type { Brewery } from '$lib/types';
	import { cardPhoto, heroPhoto, thumbPhoto } from '$lib/atmosphere';
	import Icon from './Icon.svelte';

	/* Hallmark · component: brewery-photo · shows atmosphere photography with a
	 * graceful branded fallback when the image 404s or fails to load. Never
	 * shows a broken-image icon or a grey box. */
	type Variant = 'card' | 'hero' | 'thumb';
	interface Props {
		brewery: Brewery;
		variant?: Variant;
		alt?: string;
		class?: string;
	}
	let { brewery, variant = 'card', alt = '', class: klass = '' }: Props = $props();

	const src = $derived(
		variant === 'hero'
			? heroPhoto(brewery)
			: variant === 'thumb'
				? thumbPhoto(brewery)
				: cardPhoto(brewery)
	);
	let failed = $state(false);
</script>

{#if failed}
	<div
		class="flex h-full w-full items-center justify-center bg-gradient-to-br from-[var(--color-hop-100)] via-[var(--color-cream-200)] to-[var(--color-amber-300)] {klass}"
		aria-hidden="true"
	>
		<span class="text-[var(--color-hop-500)]"><Icon name="compass" size={40} /></span>
	</div>
{:else}
	<img
		{src}
		{alt}
		loading="lazy"
		class="h-full w-full object-cover {klass}"
		onerror={() => (failed = true)}
	/>
{/if}
