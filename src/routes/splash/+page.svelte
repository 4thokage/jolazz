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

<!-- Fixed full-bleed: escapes the centered app shell so it fills the viewport on web too -->
<section
	class="fixed inset-0 z-50 flex flex-col items-center justify-between overflow-hidden px-6 pt-14 pb-10 text-center text-white"
>
	<!-- Layered premium backdrop: deep hop wash + warm amber bloom, not a flat gradient -->
	<div
		class="pointer-events-none absolute inset-0"
		style="background:
			radial-gradient(120% 80% at 50% -10%, oklch(38% 0.07 150 / 0.95), transparent 60%),
			radial-gradient(90% 60% at 50% 115%, oklch(58% 0.12 42 / 0.55), transparent 55%),
			linear-gradient(180deg, oklch(25% 0.05 150) 0%, oklch(31% 0.06 150) 100%);"
		aria-hidden="true"
	></div>
	<!-- faint hop-cone glow, top-right -->
	<div
		class="pointer-events-none absolute -top-10 -right-16 h-72 w-72 opacity-20"
		style="background: radial-gradient(circle at 30% 30%, oklch(66% 0.15 70 / 0.6), transparent 60%);"
		aria-hidden="true"
	></div>

	<div class="relative flex-1"></div>

	<!-- Beer-pour animation: a glass fills with amber, foam rises -->
	<div class="relative flex flex-1 flex-col items-center justify-center">
		<div class="relative mb-10 h-44 w-36" aria-hidden="true">
			<!-- pour stream (above the glass) -->
			<div
				class="pour absolute top-0 left-1/2 h-14 w-1.5 -translate-x-1/2 rounded-full bg-white/70"
			></div>
			<!-- glass: thick rounded outline -->
			<svg
				viewBox="0 0 144 176"
				class="absolute inset-0 h-full w-full text-white"
				fill="none"
				stroke="currentColor"
				stroke-width="7"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path d="M44 40h56v104a18 18 0 0 1-18 18H62a18 18 0 0 1-18-18z" />
				<path d="M100 64h22a14 14 0 0 1 0 28h-22" />
			</svg>
			<!-- beer fill clipped to the glass body -->
			<div
				class="absolute inset-x-[22px] top-[48px] bottom-[18px] overflow-hidden rounded-b-[14px]"
			>
				<div
					class="beer-fill absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,oklch(66%_0.15_70),oklch(58%_0.12_42))]"
				></div>
			</div>
			<!-- foam head -->
			<div class="foam absolute top-[26px] left-1/2 -translate-x-1/2">
				<div class="relative h-12 w-24">
					<span class="absolute top-4 left-1 h-8 w-8 rounded-full bg-white/95"></span>
					<span class="absolute top-1 left-8 h-9 w-9 rounded-full bg-white"></span>
					<span class="absolute top-4 right-0 h-8 w-8 rounded-full bg-white/95"></span>
				</div>
			</div>
		</div>

		<h1 class="leading-none font-semibold text-[var(--text-display)] drop-shadow-sm">
			{m.app_name()}
		</h1>
		<p class="mt-4 font-light text-[var(--text-lg)] text-white/90">{m.tagline()}</p>
	</div>

	<div class="relative flex w-full flex-col gap-3">
		<h2 class="font-semibold text-[var(--text-h1)] drop-shadow-sm">
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

<style>
	.beer-fill {
		height: 0%;
		animation: pour-fill 1700ms cubic-bezier(0.22, 1, 0.36, 1) 300ms forwards;
	}
	.foam {
		opacity: 0;
		transform: translate(-50%, 8px);
		animation: foam-in 500ms ease-out 1700ms forwards;
	}
	.pour {
		opacity: 0;
		animation:
			pour-on 300ms ease-out 200ms forwards,
			pour-off 400ms ease-in 1600ms forwards;
	}

	@keyframes pour-fill {
		to {
			height: 100%;
		}
	}
	@keyframes foam-in {
		to {
			opacity: 1;
			transform: translate(-50%, 0);
		}
	}
	@keyframes pour-on {
		to {
			opacity: 1;
		}
	}
	@keyframes pour-off {
		to {
			opacity: 0;
			transform: translate(-50%, 16px);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.beer-fill {
			height: 100%;
			animation: none;
		}
		.foam {
			opacity: 1;
			transform: translate(-50%, 0);
			animation: none;
		}
		.pour {
			opacity: 0;
			animation: none;
		}
	}
</style>
