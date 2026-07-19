<script lang="ts">
	import BottomSheet from './BottomSheet.svelte';
	import Chip from './Chip.svelte';
	import Toggle from './Toggle.svelte';
	import Button from './Button.svelte';
	import type { Filters } from '$lib/types';

	interface FilterDef {
		key: keyof Filters;
		label: string;
	}
	const filterChips: FilterDef[] = [
		{ key: 'brewpub', label: 'Brewpub' },
		{ key: 'taproom', label: 'Taproom' },
		{ key: 'food', label: 'Food' },
		{ key: 'dogFriendly', label: 'Dog friendly' },
		{ key: 'accessible', label: 'Accessible' }
	];

	const toggleFilters: FilterDef[] = [
		{ key: 'openNow', label: 'Open now' },
		{ key: 'eventsToday', label: 'Events today' },
		{ key: 'familyFriendly', label: 'Family friendly' },
		{ key: 'outdoorSeating', label: 'Outdoor seating' }
	];

	interface Props {
		open: boolean;
		onclose: () => void;
		filters: Filters;
		onchange: (f: Filters) => void;
		onapply: () => void;
	}
	let { open, onclose, filters, onchange, onapply }: Props = $props();

	function toggleChip(key: keyof Filters) {
		const next: Record<string, unknown> = { ...filters };
		if (next[key]) delete next[key];
		else next[key] = true;
		onchange(next as Filters);
	}
	function toggleSwitch(key: keyof Filters, v: boolean) {
		const next: Record<string, unknown> = { ...filters };
		if (v) next[key] = true;
		else delete next[key];
		onchange(next as Filters);
	}
</script>

<BottomSheet {open} {onclose} title="Filters">
	<div class="space-y-5">
		<div>
			<p
				class="mb-2 font-semibold tracking-wide text-[var(--color-slate-faint)] text-[var(--text-sm)] uppercase"
			>
				Type & amenities
			</p>
			<div class="flex flex-wrap gap-2">
				{#each filterChips as f (f.key)}
					<Chip active={!!filters[f.key]} onclick={() => toggleChip(f.key)} label={f.label} />
				{/each}
			</div>
		</div>

		<div class="divide-y divide-[var(--color-line)]">
			{#each toggleFilters as f (f.key)}
				<Toggle
					label={f.label}
					checked={!!filters[f.key]}
					onchange={(v) => toggleSwitch(f.key, v)}
				/>
			{/each}
			<Toggle
				label="Within 5 km"
				checked={filters.maxDistanceMeters === 5000}
				onchange={(v) => {
					const next: Record<string, unknown> = { ...filters };
					if (v) next.maxDistanceMeters = 5000;
					else delete next.maxDistanceMeters;
					onchange(next as Filters);
				}}
			/>
		</div>

		<div class="flex gap-3 pt-2">
			<Button
				variant="secondary"
				onclick={() => {
					onchange({});
				}}
			>
				Clear all
			</Button>
			<Button
				onclick={() => {
					onapply();
					onclose();
				}}
			>
				Show results
			</Button>
		</div>
	</div>
</BottomSheet>
