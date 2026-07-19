<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { setLocale, locales } from '$lib/paraglide/runtime';
	import { appState } from '$lib/app-state.svelte';
	import { getLocale } from '$lib/paraglide/runtime';
	import Toggle from '$lib/components/Toggle.svelte';
	import Icon from '$lib/components/Icon.svelte';

	const currentLocale = $derived(getLocale());
	const currentUnit = $derived(appState.unit);

	const languageNames: Record<string, string> = { en: 'English', pt: 'Português' };
</script>

<svelte:head><title>{m.app_name()} · {m.settings_title()}</title></svelte:head>

<section class="px-4 pt-6 pb-4">
	<header class="mb-5">
		<h1 class="font-semibold text-[var(--color-slate)] text-[var(--text-h1)]">
			{m.settings_title()}
		</h1>
	</header>

	<div class="space-y-6">
		<div>
			<h2
				class="mb-2 flex items-center gap-2 font-semibold text-[var(--color-slate)] text-[var(--text-h2)]"
			>
				<Icon name="compass" size={20} /><span>{m.settings_units()}</span>
			</h2>
			<Toggle
				label={m.settings_units_km()}
				description={m.settings_units_mi()}
				checked={currentUnit === 'km'}
				onchange={(v) => appState.setUnit(v ? 'km' : 'mi')}
			/>
		</div>

		<div>
			<h2
				class="mb-2 flex items-center gap-2 font-semibold text-[var(--color-slate)] text-[var(--text-h2)]"
			>
				<Icon name="language" size={20} /><span>{m.settings_language()}</span>
			</h2>
			<div class="flex gap-2">
				{#each locales as loc (loc)}
					<button
						type="button"
						onclick={() => setLocale(loc)}
						class="flex-1 rounded-full px-4 py-3 font-medium text-[var(--text-base)] transition-colors focus-visible:ring-2 focus-visible:ring-[var(--color-copper-400)] focus-visible:outline-none {loc ===
						currentLocale
							? 'bg-[var(--color-hop-600)] text-white'
							: 'bg-[var(--color-cream-200)] text-[var(--color-slate-soft)]'}"
					>
						{languageNames[loc] ?? loc}
					</button>
				{/each}
			</div>
		</div>

		<div>
			<h2
				class="mb-2 flex items-center gap-2 font-semibold text-[var(--color-slate)] text-[var(--text-h2)]"
			>
				<Icon name="globe" size={20} /><span>{m.settings_about()}</span>
			</h2>
			<p class="leading-relaxed text-[var(--color-muted)] text-[var(--text-sm)]">
				{m.settings_about_desc()}
			</p>
		</div>

		<div>
			<h2
				class="mb-2 flex items-center gap-2 font-semibold text-[var(--color-slate)] text-[var(--text-h2)]"
			>
				<Icon name="bookmark" size={20} /><span>{m.settings_privacy()}</span>
			</h2>
			<p class="leading-relaxed text-[var(--color-muted)] text-[var(--text-sm)]">
				{m.settings_privacy_desc()}
			</p>
		</div>
	</div>
</section>
