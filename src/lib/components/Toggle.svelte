<script lang="ts">
	/* Reusable toggle row for settings + filter sheets. */
	interface Props {
		label: string;
		description?: string;
		checked?: boolean;
		onchange?: (v: boolean) => void;
	}
	let { label, description, checked = false, onchange }: Props = $props();
</script>

<div class="flex items-center justify-between gap-4 py-3">
	<div class="min-w-0">
		<p class="font-medium text-[var(--color-slate)] text-[var(--text-base)]">{label}</p>
		{#if description}
			<p class="text-[var(--color-muted)] text-[var(--text-sm)]">{description}</p>
		{/if}
	</div>
	<button
		type="button"
		role="switch"
		aria-checked={checked}
		aria-label={label}
		onclick={() => onchange?.(!checked)}
		class="relative h-7 w-12 shrink-0 rounded-full transition-colors duration-[var(--dur-fast)] ease-[var(--ease-out)] focus-visible:ring-2 focus-visible:ring-[var(--color-copper-400)] focus-visible:outline-none {checked
			? 'bg-[var(--color-hop-600)]'
			: 'bg-[var(--color-cream-200)]'}"
	>
		<span
			class="absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-transform duration-[var(--dur-fast)] ease-[var(--ease-out)] {checked
				? 'translate-x-6'
				: 'translate-x-1'}"
		></span>
	</button>
</div>
