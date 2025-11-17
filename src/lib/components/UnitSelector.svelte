<script lang="ts">
	import { createEventDispatcher, onMount, onDestroy } from 'svelte';
	import { getUnitsForUi, getNextPrefix, prefixSymbols } from '$lib/data/units.data';

	// Props
	export let groupName: string;
	export let initialUnit: string = '';
	export let initialPrefix: string = '';

	// State
	let selectedUnit: string;
	let selectedPrefix: string;
	let unitList: { symbol: string; name: string }[] = [];
	let isDropdownOpen = false;
	let containerNode: HTMLDivElement; // For click-outside logic

	const dispatch =
		createEventDispatcher<{
			change: { unit: string; prefix: string };
		}>();

	onMount(() => {
		unitList = getUnitsForUi(groupName);
		updateFromProps();
		document.addEventListener('click', handleClickOutside, true);
	});

	function updateFromProps() {
		if (unitList.length > 0) {
			selectedUnit =
				initialUnit && unitList.some((u) => u.symbol === initialUnit)
					? initialUnit
					: unitList[0]?.symbol || '';

			selectedPrefix =
				initialPrefix && prefixSymbols.includes(initialPrefix) ? initialPrefix : '';
		}
	}

	// React to prop changes
	$: if (groupName) {
		const newUnitList = getUnitsForUi(groupName);
		if (JSON.stringify(newUnitList) !== JSON.stringify(unitList)) {
			unitList = newUnitList;
			updateFromProps();
		}
	}

	$: if ((initialUnit && initialUnit !== selectedUnit) || (initialPrefix && initialPrefix !== selectedPrefix)) {
		updateFromProps();
	}

	onDestroy(() => {
		if (typeof document !== 'undefined') {
			document.removeEventListener('click', handleClickOutside, true);
		}
	});

	// Generate combined prefix+unit display (e.g., "mV", "V", "kV")
	$: combinedUnit = selectedPrefix ? `${selectedPrefix}${selectedUnit}` : selectedUnit;

	function changePrefix(direction: 'up' | 'down') {
		selectedPrefix = getNextPrefix(selectedPrefix, direction);
		dispatch('change', { unit: selectedUnit, prefix: selectedPrefix });
	}

	function selectUnit(unitSymbol: string) {
		selectedUnit = unitSymbol;
		isDropdownOpen = false;
		dispatch('change', { unit: selectedUnit, prefix: selectedPrefix });
	}

	function toggleDropdown() {
		isDropdownOpen = !isDropdownOpen;
	}

	function handleClickOutside(event: MouseEvent) {
		if (containerNode && !containerNode.contains(event.target as Node)) {
			isDropdownOpen = false;
		}
	}
</script>

<div
	bind:this={containerNode}
	class="relative w-20 font-sans border border-gray-300 rounded-lg overflow-hidden shadow-sm bg-white"
>
	<div class="flex items-center justify-between bg-blue-300 text-black">
		<div class="flex-1 text-left pl-2 py-1 text-lg font-bold">
			{combinedUnit}
		</div>

		<div class="flex flex-col border-l border-blue-400">
			<button
				on:click|stopPropagation={() => changePrefix('up')}
				class="w-6 h-6 flex items-center justify-center text-xs hover:bg-blue-400 focus:outline-none text-black"
				aria-label="Increase prefix"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-4 w-4"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					stroke-width="3"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7" />
				</svg>
			</button>
			<button
				on:click|stopPropagation={() => changePrefix('down')}
				class="w-6 h-6 flex items-center justify-center text-xs border-t border-blue-400 hover:bg-blue-400 focus:outline-none text-black"
				aria-label="Decrease prefix"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-4 w-4"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					stroke-width="3"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
				</svg>
			</button>
		</div>
	</div>

	<button
		on:click|stopPropagation={toggleDropdown}
		class="w-full bg-white text-gray-800 text-center py-1 text-lg font-bold hover:bg-gray-50 focus:outline-none"
	>
		{selectedUnit}
	</button>

	{#if isDropdownOpen}
		<div
			class="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-b-lg shadow-lg z-10 max-h-48 overflow-y-auto"
		>
			<ul>
				{#each unitList as unit (unit.symbol)}
					<li
						on:click|stopPropagation={() => selectUnit(unit.symbol)}
						class="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer {unit.symbol ===
						selectedUnit
							? 'font-bold bg-gray-100'
							: ''}"
					>
						{unit.name} ({unit.symbol})
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</div>

