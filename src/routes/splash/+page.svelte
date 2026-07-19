<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { m } from '$lib/paraglide/messages';
	import { requestLocation } from '$lib/geo';
	import { appState } from '$lib/app-state.svelte';
	import Button from '$lib/components/Button.svelte';
	import Icon from '$lib/components/Icon.svelte';

	let locating = $state(false);

	async function useLocation() {
		locating = true;
		const c = await requestLocation();
		appState.setOrigin(c);
		locating = false;
		await goto(resolve(`/explore?lat=${c.lat}&lng=${c.lng}&unit=${appState.unit}`));
	}

	function skip() {
		const c = appState.origin;
		goto(resolve(`/explore?lat=${c.lat}&lng=${c.lng}&unit=${appState.unit}`));
	}
</script>

<svelte:head><title>{m.app_name()}</title></svelte:head>

<section
	class="relative flex min-h-dvh flex-col items-center justify-between overflow-hidden px-6 pt-14 pb-10 text-center"
	style="background: linear-gradient(160deg, var(--color-hop-700) 0%, var(--color-hop-500) 45%, var(--color-amber-500) 120%);"
>
	<!-- soft radial glow -->
	<div
		class="pointer-events-none absolute inset-0"
		style="background: radial-gradient(60% 40% at 50% 30%, oklch(97% 0.018 95 / 0.18), transparent 70%);"
		aria-hidden="true"
	></div>

	<div class="relative flex-1"></div>

	<div class="relative flex flex-1 flex-col items-center justify-center">
		<!-- compass mark -->
		<div class="relative mb-10 grid h-32 w-32 place-items-center">
			<svg
				viewBox="0 0 128 128"
				class="absolute inset-0 text-white/15"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				aria-hidden="true"
			>
				<circle cx="64" cy="64" r="60" />
				<circle cx="64" cy="64" r="46" />
			</svg>
			<span class="relative text-white drop-shadow-sm"><Icon name="compass" size={56} /></span>
		</div>

		<h1 class="leading-none font-semibold text-[var(--text-display)] text-white drop-shadow-sm">
			{m.app_name()}
		</h1>
		<p class="mt-4 max-w-xs font-light text-[var(--text-lg)] text-white/90">{m.tagline()}</p>
	</div>

	<div class="relative flex w-full max-w-sm flex-col gap-3">
		<h2 class="font-semibold text-[var(--text-h1)] text-white drop-shadow-sm">
			{m.splash_title()}
		</h2>
		<p class="mb-2 font-light text-[var(--text-sm)] text-white/85">{m.splash_subtitle()}</p>
		<Button
			onclick={useLocation}
			loading={locating}
			class="!bg-white !text-[var(--color-hop-700)] shadow-[var(--shadow-card)] hover:!bg-[var(--color-cream-200)]"
		>
			<Icon name="pin" size={20} />
			{m.splash_cta()}
		</Button>
		<Button variant="ghost" onclick={skip} class="!text-white hover:!bg-white/10">
			{m.splash_skip()}
		</Button>
		<p class="mt-3 font-light text-[var(--text-xs)] text-white/70">
			No account needed — your passport stays on this device.
		</p>
	</div>
</section>
