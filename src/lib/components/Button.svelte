<script lang="ts">
	import type { Snippet } from 'svelte';

	/* Hallmark · component: button · states: default hover focus active disabled loading error success */
	type Variant = 'primary' | 'secondary' | 'ghost';
	interface Props {
		variant?: Variant;
		type?: 'button' | 'submit';
		disabled?: boolean;
		loading?: boolean;
		href?: string;
		onclick?: (e: MouseEvent) => void;
		children: Snippet;
		class?: string;
		'aria-label'?: string;
	}

	let {
		variant = 'primary',
		type = 'button',
		disabled = false,
		loading = false,
		href,
		onclick,
		children,
		class: klass = '',
		'aria-label': ariaLabel
	}: Props = $props();

	const base =
		'inline-flex items-center justify-center gap-2 font-medium rounded-full ' +
		'transition-[transform,background,color,box-shadow] duration-[var(--dur-fast)] ease-[var(--ease-out)] ' +
		'min-h-11 px-5 text-[var(--text-base)] cursor-pointer select-none ' +
		'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-copper-400)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] ' +
		'active:translate-y-px disabled:opacity-50 disabled:pointer-events-none';

	const variants: Record<Variant, string> = {
		primary:
			'bg-[var(--color-hop-600)] text-white shadow-[var(--shadow-card)] hover:bg-[var(--color-hop-700)]',
		secondary:
			'bg-[var(--color-card)] text-[var(--color-hop-700)] border border-[var(--color-line)] hover:bg-[var(--color-cream-200)]',
		ghost: 'bg-transparent text-[var(--color-hop-700)] hover:bg-[var(--color-cream-200)]'
	};
</script>

{#if href}
	<a {href} class="{base} {variants[variant]} {klass}" aria-label={ariaLabel}
		>{@render children()}</a
	>
{:else}
	<button
		{type}
		{disabled}
		{onclick}
		class="{base} {variants[variant]} {klass}"
		aria-label={ariaLabel}
		aria-busy={loading}
	>
		{#if loading}<span
				class="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
				aria-hidden="true"
			></span>{/if}
		{@render children()}
	</button>
{/if}
