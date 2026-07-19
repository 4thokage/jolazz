<script lang="ts">
	import { page } from '$app/state';
	import Icon from './Icon.svelte';

	/* Persistent mobile tab bar: Explore · Search · Map · Favorites. */
	const tabs = [
		{ href: '/explore', icon: 'compass', key: 'explore', label: 'Explore' },
		{ href: '/search', icon: 'search', key: 'search', label: 'Search' },
		{ href: '/map', icon: 'map', key: 'map', label: 'Map' },
		{ href: '/favorites', icon: 'bookmark', key: 'favorites', label: 'Favorites' }
	] as const;

	const current = $derived(page.url.pathname);
</script>

<nav
	class="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--color-line)] bg-[var(--color-card)]/90 pb-[env(safe-area-inset-bottom)] shadow-[var(--shadow-tab)] backdrop-blur-md"
	aria-label="Primary"
>
	<ul class="mx-auto flex max-w-[34rem] items-stretch justify-around px-2">
		{#each tabs as tab (tab.key)}
			{@const active = current.startsWith(tab.href)}
			<li class="flex-1">
				<a
					href={tab.href}
					aria-current={active ? 'page' : undefined}
					class="flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl py-2 font-medium text-[var(--text-xs)] transition-colors focus-visible:ring-2 focus-visible:ring-[var(--color-copper-400)] focus-visible:outline-none {active
						? 'text-[var(--color-hop-600)]'
						: 'text-[var(--color-slate-faint)]'}"
				>
					<Icon name={tab.icon} size={24} />
					<span>{tab.label}</span>
				</a>
			</li>
		{/each}
	</ul>
</nav>
