<script lang="ts">
	/* Filter chip — toggle state, 44px tap target. */
	interface Props {
		active?: boolean;
		onclick?: () => void;
		label: string;
	}
	let { active = false, onclick, label }: Props = $props();
</script>

<button
	type="button"
	{onclick}
	aria-pressed={active}
	class="min-h-11 shrink-0 rounded-full border px-4 font-medium text-[var(--text-sm)] transition-colors duration-[var(--dur-fast)] ease-[var(--ease-out)] focus-visible:ring-2 focus-visible:ring-[var(--color-copper-400)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] focus-visible:outline-none {active
		? 'border-[var(--color-hop-600)] bg-[var(--color-hop-600)] text-white'
		: 'border-[var(--color-line)] bg-[var(--color-card)] text-[var(--color-slate-soft)] hover:border-[var(--color-hop-300)]'}"
>
	{label}
</button>
