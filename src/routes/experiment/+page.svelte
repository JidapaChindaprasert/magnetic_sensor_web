<script lang="ts">
	import { Pause, ArrowDownToLine, ChevronRight } from "lucide-svelte";
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { statsStore, undoLastRow, resetAllData, addTestData, xAxisUnitStore, yAxisUnitStore, initialVoltageUnitStore, type UnitState, loadExperimentConfig, clearAllData, type ExperimentConfig } from "$lib/data.ts";
	import { convert, unitMap, prefixMap } from "$lib/data/units.data.ts";
	import LineGraph from "$lib/components/LineChart.svelte";
	import UnitSelector from "$lib/components/UnitSelector.svelte";

	// Load experiment config
	let experimentConfig: ExperimentConfig | null = null;

	// Use reactive stats store - Svelte 5 auto-subscription
	// Use data from stats
	// currentReading: use last measurement
	$: stats = $statsStore;
	$: currentY = stats.length ? stats[stats.length - 1].y : 0;
	$: currentX = stats.length ? stats[stats.length - 1].x : 0;
	$: initialY = stats.length ? stats[0].y : 0;

	// Use centralized unit state stores
	let xAxisUnitState: UnitState = { unit: 'G', prefix: '' };
	let yAxisUnitState: UnitState = { unit: 'V', prefix: '' };
	let initialVoltageUnitState: UnitState = { unit: 'V', prefix: '' };

	// Subscribe to stores
	xAxisUnitStore.subscribe(value => xAxisUnitState = value);
	yAxisUnitStore.subscribe(value => yAxisUnitState = value);
	initialVoltageUnitStore.subscribe(value => initialVoltageUnitState = value);

	// Get axis config from experiment config
	$: xAxisConfig = experimentConfig?.axis.x || { name: 'X Axis', unit: 'G', prefix: '' };
	$: yAxisConfig = experimentConfig?.axis.y || { name: 'Y Axis', unit: 'V', prefix: '' };

	// Check if units are known (in unitMap) for conversion
	$: xAxisUnitKnown = unitMap.has(xAxisConfig.unit);
	$: yAxisUnitKnown = unitMap.has(yAxisConfig.unit);

	// Convert values for display
	// For known units: full conversion (unit + prefix)
	// For arbitrary units: prefix-only conversion
	$: convertedCurrentY = yAxisUnitKnown && unitMap.has(yAxisUnitState.unit)
		? (convert(
			currentY,
			yAxisConfig.unit,
			yAxisConfig.prefix,
			yAxisUnitState.unit,
			yAxisUnitState.prefix
		) ?? currentY)
		: convertPrefixOnly(
			currentY,
			yAxisConfig.prefix,
			yAxisUnitState.prefix
		);

	$: convertedCurrentX = xAxisUnitKnown && unitMap.has(xAxisUnitState.unit)
		? (convert(
			currentX,
			xAxisConfig.unit,
			xAxisConfig.prefix,
			xAxisUnitState.unit,
			xAxisUnitState.prefix
		) ?? currentX)
		: convertPrefixOnly(
			currentX,
			xAxisConfig.prefix,
			xAxisUnitState.prefix
		);

	$: convertedInitialY = yAxisUnitKnown && unitMap.has(initialVoltageUnitState.unit)
		? (convert(
			initialY,
			yAxisConfig.unit,
			yAxisConfig.prefix,
			initialVoltageUnitState.unit,
			initialVoltageUnitState.prefix
		) ?? initialY)
		: convertPrefixOnly(
			initialY,
			yAxisConfig.prefix,
			initialVoltageUnitState.prefix
		);

	// Helper function for prefix-only conversion (for arbitrary units)
	function convertPrefixOnly(value: number, fromPrefix: string, toPrefix: string): number {
		const fromPrefixFactor = prefixMap.get(fromPrefix)?.factor ?? 1;
		const toPrefixFactor = prefixMap.get(toPrefix)?.factor ?? 1;
		// Convert: apply from prefix, then remove to prefix
		return (value * fromPrefixFactor) / toPrefixFactor;
	}

	// Convert table data
	$: convertedTableData = stats.map((row) => {
		const convertedY = yAxisUnitKnown && unitMap.has(yAxisUnitState.unit)
			? convert(
				row.y,
				yAxisConfig.unit,
				yAxisConfig.prefix,
				yAxisUnitState.unit,
				yAxisUnitState.prefix
			)
			: convertPrefixOnly(
				row.y,
				yAxisConfig.prefix,
				yAxisUnitState.prefix
			);

		const convertedX = xAxisUnitKnown && unitMap.has(xAxisUnitState.unit)
			? convert(
				row.x,
				xAxisConfig.unit,
				xAxisConfig.prefix,
				xAxisUnitState.unit,
				xAxisUnitState.prefix
			)
			: convertPrefixOnly(
				row.x,
				xAxisConfig.prefix,
				xAxisUnitState.prefix
			);

		return {
			x: convertedX ?? row.x,
			y: convertedY ?? row.y
		};
	});

	// Generate unit labels for table headers using axis names
	// For unknown units, use the axis config unit but with current prefix from store
	$: yDisplayUnit = yAxisUnitKnown && unitMap.has(yAxisUnitState.unit) ? yAxisUnitState.unit : yAxisConfig.unit;
	$: yDisplayPrefix = yAxisUnitKnown && unitMap.has(yAxisUnitState.unit) ? yAxisUnitState.prefix : yAxisUnitState.prefix;
	$: yAxisLabel = yDisplayPrefix 
		? `${yAxisConfig.name} (${yDisplayPrefix}${yDisplayUnit})`
		: `${yAxisConfig.name} (${yDisplayUnit})`;
	
	$: xDisplayUnit = xAxisUnitKnown && unitMap.has(xAxisUnitState.unit) ? xAxisUnitState.unit : xAxisConfig.unit;
	$: xDisplayPrefix = xAxisUnitKnown && unitMap.has(xAxisUnitState.unit) ? xAxisUnitState.prefix : xAxisUnitState.prefix;
	$: xAxisLabel = xDisplayPrefix
		? `${xAxisConfig.name} (${xDisplayPrefix}${xDisplayUnit})`
		: `${xAxisConfig.name} (${xDisplayUnit})`;

	// Create axis configs with current prefix from stores for graph
	$: xAxisForGraph = {
		name: xAxisConfig.name,
		unit: xDisplayUnit,
		prefix: xDisplayPrefix
	};
	$: yAxisForGraph = {
		name: yAxisConfig.name,
		unit: yDisplayUnit,
		prefix: yDisplayPrefix
	};

	// Convert stats for graph display
	$: convertedStatsForGraph = stats.map((row) => {
		const convertedY = yAxisUnitKnown && unitMap.has(yAxisUnitState.unit)
			? convert(
				row.y,
				yAxisConfig.unit,
				yAxisConfig.prefix,
				yAxisUnitState.unit,
				yAxisUnitState.prefix
			)
			: convertPrefixOnly(
				row.y,
				yAxisConfig.prefix,
				yAxisUnitState.prefix
			);

		const convertedX = xAxisUnitKnown && unitMap.has(xAxisUnitState.unit)
			? convert(
				row.x,
				xAxisConfig.unit,
				xAxisConfig.prefix,
				xAxisUnitState.unit,
				xAxisUnitState.prefix
			)
			: convertPrefixOnly(
				row.x,
				xAxisConfig.prefix,
				xAxisUnitState.prefix
			);

		return {
			x: convertedX ?? row.x,
			y: convertedY ?? row.y
		};
	});

// On client mount ensure an experiment exists, otherwise redirect to setup page
onMount(() => {
	const cfg = loadExperimentConfig();
	if (!cfg) {
		goto('/experiment/new');
	} else {
		experimentConfig = cfg;
	}
});
</script>

<div class="p-4 space-y-4 pb-16 bg-stone-100 min-h-full">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<h1 class="text-lg">Magnetic Sensor Display</h1>
		<div class="flex items-center gap-2">
			<button class="p-2 text-blue-900 hover:bg-gray-200 rounded-2xl p-2">
				<Pause class="w-5 h-5" />
			</button>
			<button 
				class="p-2 text-blue-900 hover:bg-gray-200 rounded-2xl p-2"
				on:click={() => {
					// Add constant test data - easy to modify for future implementation
					const TEST_X = 2100;
					const TEST_Y = 0.8260;
					addTestData(TEST_X, TEST_Y);
				}}
			>
				<ArrowDownToLine class="w-5 h-5" />
			</button>
			<button
				class="px-4 py-2 bg-blue-700/70 rounded-xl border-blue-900 shadow-sm
				transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-105 hover:bg-blue-900 text-sm text-stone-100"
			>
				update
			</button>
		</div>
	</div>

	<!-- Current Reading Display -->
	<div class="bg-stone border-2 border-blue-300 rounded-2xl p-6 text-center">
		<div class="text-4xl mb-1">{convertedCurrentY.toFixed(4)}</div>
		<div class="text-xs text-gray-500">{yAxisLabel}</div>
	</div>

	<!-- Detailed Readings -->
	<div class="space-y-2">
		<div class="flex items-center justify-between">
			<span class="text-sm text-gray-700">{yAxisConfig.name}</span>
			<div class="flex items-center gap-2">
				<span class="text-gray-800">: {convertedCurrentY.toFixed(4)}</span>
				<UnitSelector
					unitSymbol={yAxisConfig.unit}
					initialUnit={yAxisUnitKnown ? yAxisUnitState.unit : yAxisConfig.unit}
					initialPrefix={yAxisUnitState.prefix}
					allowUnitSelection={yAxisUnitKnown}
					on:change={(e) => {
						// For arbitrary units, keep the axis config unit but update prefix
						const newUnit = yAxisUnitKnown ? e.detail.unit : yAxisConfig.unit;
						yAxisUnitStore.set({ unit: newUnit, prefix: e.detail.prefix });
					}}
				/>
			</div>
		</div>

		<div class="flex items-center justify-between">
			<span class="text-sm text-gray-700">{xAxisConfig.name}</span>
			<div class="flex items-center gap-2">
				<span class="text-gray-800">: {convertedCurrentX.toFixed(4)}</span>
				<UnitSelector
					unitSymbol={xAxisConfig.unit}
					initialUnit={xAxisUnitKnown ? xAxisUnitState.unit : xAxisConfig.unit}
					initialPrefix={xAxisUnitState.prefix}
					allowUnitSelection={xAxisUnitKnown}
					on:change={(e) => {
						// For arbitrary units, keep the axis config unit but update prefix
						const newUnit = xAxisUnitKnown ? e.detail.unit : xAxisConfig.unit;
						xAxisUnitStore.set({ unit: newUnit, prefix: e.detail.prefix });
					}}
				/>
			</div>
		</div>

		<div class="flex items-center justify-between">
			<span class="text-sm text-gray-700">Initial {yAxisConfig.name} (Y0)</span>
			<div class="flex items-center gap-2">
				<span class="text-gray-800">: {convertedInitialY.toFixed(4)}</span>
				<UnitSelector
					unitSymbol={yAxisConfig.unit}
					initialUnit={yAxisUnitKnown ? initialVoltageUnitState.unit : yAxisConfig.unit}
					initialPrefix={initialVoltageUnitState.prefix}
					allowUnitSelection={yAxisUnitKnown}
					on:change={(e) => {
						// For arbitrary units, keep the axis config unit but update prefix
						const newUnit = yAxisUnitKnown ? e.detail.unit : yAxisConfig.unit;
						initialVoltageUnitStore.set({ unit: newUnit, prefix: e.detail.prefix });
					}}
				/>
			</div>
		</div>
	</div>

		<!-- Action Buttons -->
	<div class="flex gap-3">
		<button 
			class="flex-1 py-3 bg-blue-200/70 rounded-xl text-sm shadow-md transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-105 hover:bg-blue-300/70"
			on:click={() => undoLastRow()}
		>
			Undo
		</button>
		<button 
			class="flex-1 py-3 bg-blue-200/70 rounded-xl text-sm shadow-md transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-105 hover:bg-blue-300/70"
			on:click={() => resetAllData()}
		>
			Reset
		</button>
			<button
				class="flex-1 py-3 bg-red-500/80 rounded-xl text-sm shadow-md text-white transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-105 hover:bg-red-600/80"
				on:click={() => {
					if (confirm('Start a new experiment? This will clear existing data.')) {
						clearAllData();
						goto('/experiment/new');
					}
				}}
			>
				New Experiment
			</button>
	</div>

	<!-- Data Table -->
	<div class="bg-stone rounded-xl border-2 border-blue-300 overflow-hidden">
		<table class="w-full">
			<thead class="bg-blue-100">
				<tr>
					<th class="px-3 py-2 text-center text-sm text-gray-700"
						>No.</th
					>
					<th class="px-3 py-2 text-center text-sm text-gray-700"
						>{xAxisLabel}</th
					>
					<th class="px-3 py-2 text-center text-sm text-gray-700">
						{yAxisLabel}
					</th>
				</tr>
			</thead>
			<tbody>
				{#each convertedTableData as row, i}
					<tr class="border-t border-blue-100">
						<td class="px-3 py-3 text-sm text-center">{i + 1}</td>
						<td class="px-3 py-3 text-sm text-center">{row.x.toFixed(4)}</td>
						<td class="px-3 py-3 text-sm text-center">{row.y.toFixed(4)}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>



	<!-- Graph Placeholder -->
	<div class="bg-white rounded-xl p-4 border-2 border-blue-200">
		<div class="flex items-center justify-between mb-3">
			<h3 class="text-sm text-gray-700">Graph</h3>
			<a href="/graph"><ChevronRight class="w-5 h-5 text-blue-300" /></a>
		</div>
		<div
			class="h-full w-full bg-blue-50 rounded-lg flex items-center justify-center text-blue-300 text-sm"
		>
			<LineGraph 
				stats={convertedStatsForGraph}
				xAxis={xAxisForGraph}
				yAxis={yAxisForGraph}
			/>
		</div>
	</div>
</div>
