<script lang="ts">
	/* Hallmark · component: toggle · states: default hover focus active disabled
	 * Premium pill switch: thick track, generous knob, smooth damped motion. */
	interface Props {
		label: string;
		description?: string;
		checked?: boolean;
		disabled?: boolean;
		onchange?: (v: boolean) => void;
	}
	let { label, description, checked = false, disabled = false, onchange }: Props = $props();
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
		{disabled}
		onclick={() => !disabled && onchange?.(!checked)}
		class="relative h-8 w-14 shrink-0 rounded-full transition-colors duration-[var(--dur-base)] ease-[var(--ease-out)] focus-visible:ring-2 focus-visible:ring-[var(--color-copper-400)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] focus-visible:outline-none active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40 {checked
			? 'bg-[var(--color-hop-600)]'
			: 'bg-[var(--color-slate-faint)]/40'}"
	>
		<span
			class="absolute top-1 h-6 w-6 rounded-full bg-white shadow-[0_1px_3px_oklch(20%_0.02_150_/_0.3)] transition-transform duration-[var(--dur-base)] ease-[var(--ease-out)] {checked
				? 'translate-x-7'
				: 'translate-x-1'}"
		></span>
	</button>
</div>
