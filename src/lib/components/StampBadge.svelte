<script lang="ts">
	import Icon from './Icon.svelte';

	/* Stamp badge — shows a collected passport stamp. */
	interface Props {
		stamped?: boolean;
		size?: number;
		label?: string;
	}
	let { stamped = false, size = 56, label }: Props = $props();
</script>

<div
	class="flex flex-col items-center gap-1"
	aria-label={label ?? (stamped ? 'Stamp collected' : 'Not visited')}
>
	<div
		class="grid place-items-center rounded-full border-2 transition-colors {stamped
			? 'border-[var(--color-copper-500)] bg-[var(--color-amber-300)] text-[var(--color-copper-600)]'
			: 'border-dashed border-[var(--color-line)] bg-[var(--color-cream-200)] text-[var(--color-slate-faint)]'}"
		style="width:{size}px;height:{size}px"
	>
		<Icon name="star" size={size * 0.42} />
	</div>
	{#if label}
		<span class="max-w-[5rem] truncate text-center text-[var(--color-muted)] text-[var(--text-xs)]"
			>{label}</span
		>
	{/if}
</div>
