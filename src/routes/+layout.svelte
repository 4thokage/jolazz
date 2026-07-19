<script lang="ts">
	import { page } from '$app/state';
	import './layout.css';
	import '@fontsource/fraunces/400.css';
	import '@fontsource/fraunces/500.css';
	import '@fontsource/fraunces/600.css';
	import '@fontsource/inter/300.css';
	import '@fontsource/inter/400.css';
	import '@fontsource/inter/500.css';
	import '@fontsource/inter/600.css';
	import favicon from '$lib/assets/favicon.svg';
	import BottomTabBar from '$lib/components/BottomTabBar.svelte';

	let { children } = $props();

	const path = $derived(page.url.pathname);
	const showTabs = $derived(!path.startsWith('/splash') && !path.startsWith('/brewery/'));
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="app-shell">
	<main class="app-main">
		{@render children()}
	</main>
	{#if showTabs}
		<BottomTabBar />
	{/if}
</div>
