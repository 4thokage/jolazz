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

	// Loop the beer-pour: pour -> fill -> foam -> retract -> reset.
	let phase = $state<'idle' | 'pouring' | 'filled' | 'resting'>('idle');
	$effect(() => {
		const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
		if (reduce) {
			phase = 'filled';
			return;
		}
		let timer: ReturnType<typeof setTimeout>;
		const tick = () => {
			phase = 'pouring';
			timer = setTimeout(() => {
				phase = 'filled';
				timer = setTimeout(() => {
					phase = 'resting';
					timer = setTimeout(() => {
						phase = 'idle';
						timer = setTimeout(tick, 900);
					}, 2600);
				}, 600);
			}, 1500);
		};
		tick();
		return () => clearTimeout(timer);
	});
</script>

<svelte:head><title>{m.app_name()}</title></svelte:head>

<!-- Fixed full-bleed: escapes the centered app shell so it fills the viewport on web too -->
<section
	class="fixed inset-0 z-50 flex flex-col items-center justify-between overflow-hidden px-6 pt-14 pb-10 text-center text-white"
>
	<!-- Warm "beery" backdrop: hop-green base, amber/foam bloom, hop-cone texture -->
	<div
		class="pointer-events-none absolute inset-0"
		style="background:
			radial-gradient(110% 75% at 50% -15%, oklch(40% 0.08 150 / 0.95), transparent 58%),
			radial-gradient(80% 55% at 18% 8%, oklch(70% 0.14 75 / 0.32), transparent 55%),
			radial-gradient(90% 60% at 82% 100%, oklch(58% 0.12 42 / 0.42), transparent 58%),
			linear-gradient(180deg, oklch(27% 0.06 150) 0%, oklch(33% 0.07 95) 100%);"
		aria-hidden="true"
	></div>
	<!-- soft foam/hop bloom, top-right -->
	<div
		class="pointer-events-none absolute -top-16 -right-20 h-80 w-80 opacity-25"
		style="background: radial-gradient(circle at 35% 35%, oklch(82% 0.1 75 / 0.7), transparent 60%);"
		aria-hidden="true"
	></div>
	<!-- faint hop-cone, bottom-left -->
	<div
		class="pointer-events-none absolute -bottom-10 -left-12 h-64 w-64 opacity-15"
		style="background: radial-gradient(circle at 60% 40%, oklch(66% 0.15 70 / 0.6), transparent 62%);"
		aria-hidden="true"
	></div>

	<div class="relative flex-1"></div>

	<!-- Beer-pour animation (adapted from madebygus' CSS beer pour, branded + looping) -->
	<div class="relative flex flex-1 flex-col items-center justify-center">
		<div class="relative mb-10 h-48 w-40" aria-hidden="true">
			<!-- pour stream (above the glass) -->
			<div
				class="pour absolute top-0 left-1/2 h-16 w-2 -translate-x-1/2 rounded-full bg-[linear-gradient(180deg,oklch(82%_0.1_75),oklch(66%_0.15_70))] {phase ===
				'pouring'
					? 'opacity-100'
					: 'translate-y-4 opacity-0'}"
			></div>

			<!-- glass: cream border, subtle perspective tilt, highlight streaks -->
			<div class="glass absolute inset-0"></div>

			<!-- beer body (rises from the bottom) -->
			<div
				class="beer absolute inset-x-[14px] top-[20px] bottom-[14px] overflow-hidden rounded-b-[10px] {phase ===
					'pouring' || phase === 'filled'
					? 'is-fill'
					: ''}"
			>
				<div
					class="absolute inset-x-0 bottom-0 h-full bg-[linear-gradient(180deg,oklch(72%_0.14_75),oklch(58%_0.12_42))]"
				></div>
				<div class="absolute inset-y-0 right-0 w-1/2 bg-[oklch(58%_0.12_42_/_0.55)]"></div>
			</div>

			<!-- foam head (lifts into place) -->
			<div
				class="head absolute left-1/2 h-12 w-28 -translate-x-1/2 {phase === 'filled' ||
				phase === 'resting'
					? 'bottom-[78%] opacity-100'
					: 'bottom-0 opacity-0'}"
			>
				<div class="relative h-full w-full rounded-[50%] bg-[oklch(97%_0.02_95)]">
					<span class="absolute top-2 left-3 h-7 w-7 rounded-full bg-white"></span>
					<span class="absolute top-0 left-12 h-8 w-8 rounded-full bg-[oklch(98%_0.015_95)]"></span>
					<span class="absolute top-3 right-2 h-7 w-7 rounded-full bg-white"></span>
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
	/* Glass: cream border, perspective tilt, white highlight streaks */
	.glass {
		border: solid 9px oklch(95% 0.02 95 / 0.92);
		border-top: solid 5px oklch(95% 0.02 95 / 0.92);
		border-bottom: solid 26px oklch(95% 0.02 95 / 0.92);
		border-radius: 6px;
		transform: perspective(520px) rotateX(-26deg);
	}
	.glass::before,
	.glass::after {
		content: '';
		position: absolute;
		border-radius: 10px;
		background: oklch(100% 0 0 / 0.55);
		width: 8px;
	}
	.glass::before {
		height: 18%;
		left: 9px;
		top: 6%;
		z-index: 2;
	}
	.glass::after {
		height: 64%;
		right: 9px;
		top: 6%;
	}

	/* Beer rises from 0 to full */
	.beer {
		height: 0%;
		transition: height 1500ms cubic-bezier(0.4, 0, 0.2, 1);
	}
	.beer.is-fill {
		height: 100%;
	}

	/* Foam + pour motion */
	.head {
		transition:
			bottom 700ms ease-out,
			opacity 500ms ease-out;
	}
	.pour {
		transition:
			opacity 300ms ease-in,
			transform 400ms ease-in;
	}

	@media (prefers-reduced-motion: reduce) {
		.beer {
			height: 100%;
			transition: none;
		}
		.head {
			bottom: 78%;
			opacity: 1;
			transition: none;
		}
		.pour {
			opacity: 0;
			transition: none;
		}
	}
</style>
