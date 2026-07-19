<script lang="ts">
	import type { Snippet } from 'svelte';
	import Icon from './Icon.svelte';

	/* Bottom sheet — slides up from the tab bar. Used for map detail + filters. */
	interface Props {
		open: boolean;
		onclose: () => void;
		title?: string;
		children: Snippet;
	}
	let { open, onclose, title, children }: Props = $props();
</script>

{#if open}
	<div class="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={title ?? 'Panel'}>
		<button
			type="button"
			class="absolute inset-0 bg-black/30 backdrop-blur-[1px]"
			aria-label="Close"
			onclick={onclose}
		></button>
		<div
			class="absolute inset-x-0 bottom-0 max-h-[85dvh] overflow-y-auto rounded-t-[var(--radius-sheet)] bg-[var(--color-card)] pb-[env(safe-area-inset-bottom)] shadow-[var(--shadow-sheet)]"
		>
			<div
				class="sticky top-0 flex items-center justify-between border-b border-[var(--color-line)] bg-[var(--color-card)] px-5 py-3"
			>
				<h2 class="font-semibold text-[var(--text-h2)]">{title}</h2>
				<button
					type="button"
					onclick={onclose}
					aria-label="Close"
					class="grid h-10 w-10 place-items-center rounded-full text-[var(--color-slate-soft)] hover:bg-[var(--color-cream-200)] focus-visible:ring-2 focus-visible:ring-[var(--color-copper-400)] focus-visible:outline-none"
				>
					<Icon name="close" size={22} />
				</button>
			</div>
			<div class="px-5 py-4">{@render children()}</div>
		</div>
	</div>
{/if}
