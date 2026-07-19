<script lang="ts">
	interface Props {
		lines?: number;
		class?: string;
	}
	let { lines = 3, class: klass = '' }: Props = $props();
</script>

<div class="animate-pulse {klass}" aria-hidden="true">
	<div
		class="mb-3 aspect-[16/10] w-full rounded-[var(--radius-card)] bg-[var(--color-cream-200)]"
	></div>
	<div class="space-y-2 p-1">
		<div class="h-5 w-2/3 rounded bg-[var(--color-cream-200)]"></div>
		<div class="h-3 w-1/3 rounded bg-[var(--color-cream-200)]"></div>
		{#each Array(lines) as _, i (i)}
			<div class="h-3 w-full rounded bg-[var(--color-cream-200)]"></div>
		{/each}
	</div>
</div>
