<script lang="ts">
	import Icon from './Icon.svelte';

	/* Instant search input with clear button. */
	interface Props {
		value: string;
		oninput: (v: string) => void;
		placeholder?: string;
	}
	let { value, oninput, placeholder = 'Search breweries' }: Props = $props();
</script>

<div
	class="flex items-center gap-3 rounded-full border border-[var(--color-line)] bg-[var(--color-card)] px-4 py-3 shadow-[var(--shadow-card)] focus-within:ring-2 focus-within:ring-[var(--color-copper-400)]"
>
	<span class="text-[var(--color-slate-faint)]"><Icon name="search" size={20} /></span>
	<input
		type="search"
		{value}
		{placeholder}
		oninput={(e) => oninput((e.target as HTMLInputElement).value)}
		class="min-w-0 flex-1 bg-transparent text-[var(--color-slate)] text-[var(--text-base)] outline-none placeholder:text-[var(--color-slate-faint)]"
		aria-label={placeholder}
	/>
	{#if value}
		<button
			type="button"
			aria-label="Clear search"
			onclick={() => oninput('')}
			class="grid h-8 w-8 place-items-center rounded-full text-[var(--color-slate-faint)] hover:bg-[var(--color-cream-200)] focus-visible:ring-2 focus-visible:ring-[var(--color-copper-400)] focus-visible:outline-none"
		>
			<Icon name="close" size={18} />
		</button>
	{/if}
</div>
