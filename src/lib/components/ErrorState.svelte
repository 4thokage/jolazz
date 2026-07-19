<script lang="ts">
	import type { Snippet } from 'svelte';
	import Icon from './Icon.svelte';

	interface Props {
		title?: string;
		message?: string;
		children?: Snippet;
	}
	let { title = 'Something went wrong', message, children }: Props = $props();
</script>

<div class="flex flex-col items-center px-6 py-12 text-center" role="alert">
	<div
		class="mb-4 grid h-16 w-16 place-items-center rounded-full bg-[var(--color-danger)]/10 text-[var(--color-danger)]"
	>
		<Icon name="close" size={28} />
	</div>
	<h3 class="font-semibold text-[var(--color-slate)] text-[var(--text-h2)]">{title}</h3>
	{#if message}
		<p class="mt-2 max-w-xs text-[var(--color-muted)] text-[var(--text-sm)]">{message}</p>
	{/if}
	{#if children}
		<div class="mt-5">{@render children()}</div>
	{/if}
</div>
