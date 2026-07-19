<script lang="ts">
	/* Consistent stroke-weight outline icons. No skeuomorphic beer mugs. */
	export interface IconProps {
		name:
			| 'pin'
			| 'search'
			| 'map'
			| 'bookmark'
			| 'heart'
			| 'compass'
			| 'settings'
			| 'star'
			| 'phone'
			| 'globe'
			| 'instagram'
			| 'directions'
			| 'clock'
			| 'dog'
			| 'food'
			| 'wheelchair'
			| 'filter'
			| 'close'
			| 'chevron-right'
			| 'check'
			| 'spark'
			| 'language'
			| 'arrow-right'
			| 'plus';
		size?: number;
	}

	let { name, size = 24 }: IconProps = $props();

	const paths: Record<IconProps['name'], string> = {
		pin: 'M12 21s-7-7.5-7-12a7 7 0 0 1 14 0c0 4.5-7 12-7 12z M12 11a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
		search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z M21 21l-4.3-4.3',
		map: 'M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2z M9 4v14 M15 6v14',
		bookmark: 'M6 4h12v16l-6-4-6 4V4z',
		heart: 'M12 20s-7-4.5-9.5-9A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 9.5 5c-2.5 4.5-9.5 9-9.5 9z',
		compass: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M16 8l-2.5 5.5L8 16l2.5-5.5L16 8z',
		settings:
			'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 13a7.5 7.5 0 0 0 0-2l2-1.5-2-3.5-2.4 1a7.5 7.5 0 0 0-1.7-1L15 2h-4l-.3 2.5a7.5 7.5 0 0 0-1.7 1l-2.4-1-2 3.5L4.6 11a7.5 7.5 0 0 0 0 2l-2 1.5 2 3.5 2.4-1a7.5 7.5 0 0 0 1.7 1L11 22h4l.3-2.5a7.5 7.5 0 0 0 1.7-1l2.4 1 2-3.5-2-1.5z',
		star: 'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3z',
		phone:
			'M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L22 13l-2 5v0a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z',
		globe:
			'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M3 12h18 M12 3c2.5 2.5 2.5 15 0 18 M12 3c-2.5 2.5-2.5 15 0 18',
		instagram:
			'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M8.5 8.5a3.5 3.5 0 0 1 7 0v7a3.5 3.5 0 0 1-7 0v-7z M15.5 15.5l4 4',
		directions: 'M12 2v18 M8 6l4-4 4 4 M8 18l4 4 4-4',
		clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M12 7v5l3 2',
		dog: 'M5 11V8a2 2 0 0 1 2-2 M19 11V8a2 2 0 0 0-2-2 M7 6V4 M17 6V4 M5 11a7 7 0 0 0 14 0v3a3 3 0 0 1-3 3h-2v-4H10v4H8a3 3 0 0 1-3-3v-3z',
		food: 'M5 21V8a2 2 0 0 1 4 0v13 M7 8V3 M17 21v-9a3 3 0 0 0-6 0v9 M17 12h.01',
		wheelchair: 'M9 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4z M9 7v5h3l3 7 M12 12a6 6 0 1 0 0 0z',
		filter: 'M4 5h16l-6 7v6l-4 2v-8L4 5z',
		close: 'M6 6l12 12 M18 6L6 18',
		'chevron-right': 'M9 6l6 6-6 6',
		check: 'M5 12l4 4 10-10',
		spark: 'M12 3v6 M12 15v6 M3 12h6 M15 12h6 M6 6l3 3 M15 15l3 3 M18 6l-3 3 M9 15l-3 3',
		language:
			'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M3 12h18 M12 3c2.5 2.5 2.5 15 0 18 M12 3c-2.5 2.5-2.5 15 0 18',
		'arrow-right': 'M5 12h14 M13 6l6 6-6 6',
		plus: 'M12 5v14 M5 12h14'
	};
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	width={size}
	height={size}
	viewBox="0 0 24 24"
	fill="none"
	stroke="currentColor"
	stroke-width="1.75"
	stroke-linecap="round"
	stroke-linejoin="round"
	aria-hidden="true"
	focusable="false"
>
	{#each paths[name].split(' M') as d, i (i)}
		<path d={i === 0 ? d : 'M' + d} />
	{/each}
</svg>
