<script lang="ts">
	import { Pause, ArrowDownToLine, ChevronRight } from "lucide-svelte";
	import { stats, voltageUnitStore, magneticFieldUnitStore, initialVoltageUnitStore, type UnitState } from "$lib/data.ts";
	import { convert } from "$lib/data/units.data";
	import LineGraph from "$lib/components/LineChart.svelte";
	import UnitSelector from "$lib/components/UnitSelector.svelte";

	// Use data from stats
	// currentReading: use last measurement
	const currentReading = stats.length ? stats[stats.length - 1].voltage : 0;
	const currentMagnetic = stats.length ? stats[stats.length - 1].magneticfield : 0;
	const initialVoltage = stats.length ? stats[0].voltage : 0;

	// Use centralized unit state stores
	let voltageUnitState: UnitState = { unit: 'V', prefix: '' };
	let magneticFieldUnitState: UnitState = { unit: 'T', prefix: '' };
	let initialVoltageUnitState: UnitState = { unit: 'V', prefix: '' };

	// Subscribe to stores
	voltageUnitStore.subscribe(value => voltageUnitState = value);
	magneticFieldUnitStore.subscribe(value => magneticFieldUnitState = value);
	initialVoltageUnitStore.subscribe(value => initialVoltageUnitState = value);

	// Convert values for display
	$: convertedCurrentReading = convert(
		currentReading,
		'Voltage',
		'V',
		'',
		voltageUnitState.unit,
		voltageUnitState.prefix
	) ?? currentReading;

	$: convertedCurrentMagnetic = convert(
		currentMagnetic,
		'Magnetic Field',
		'G',
		'',
		magneticFieldUnitState.unit,
		magneticFieldUnitState.prefix
	) ?? currentMagnetic;

	$: convertedInitialVoltage = convert(
		initialVoltage,
		'Voltage',
		'V',
		'',
		initialVoltageUnitState.unit,
		initialVoltageUnitState.prefix
	) ?? initialVoltage;

	// Convert table data
	$: convertedTableData = stats.map((row) => {
		const convertedVoltage = convert(
			row.voltage,
			'Voltage',
			'V',
			'',
			voltageUnitState.unit,
			voltageUnitState.prefix
		);

		const convertedMagnetic = convert(
			row.magneticfield,
			'Magnetic Field',
			'G',
			'',
			magneticFieldUnitState.unit,
			magneticFieldUnitState.prefix
		);

		return {
			voltage: convertedVoltage ?? row.voltage,
			magneticfield: convertedMagnetic ?? row.magneticfield
		};
	});

	// Generate unit labels for table headers
	$: voltageUnitLabel = voltageUnitState.prefix 
		? `Voltage (${voltageUnitState.prefix}${voltageUnitState.unit})`
		: `Voltage (${voltageUnitState.unit})`;
	
	$: magneticUnitLabel = magneticFieldUnitState.prefix
		? `Magnetic Field (${magneticFieldUnitState.prefix}${magneticFieldUnitState.unit})`
		: `Magnetic Field (${magneticFieldUnitState.unit})`;
</script>

<div class="p-4 space-y-4 pb-16 bg-stone-100 min-h-full">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<h1 class="text-lg">Magnetic Sensor Display</h1>
		<div class="flex items-center gap-2">
			<button class="p-2 text-blue-900">
				<Pause class="w-5 h-5" />
			</button>
			<button class="p-2 text-blue-900">
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
		<div class="text-4xl mb-1">{currentReading.toFixed(4)}</div>
		<div class="text-xs text-gray-500">Voltage (V)</div>
	</div>

	<!-- Detailed Readings -->
	<div class="space-y-2">
		<div class="flex items-center justify-between">
			<span class="text-sm text-gray-700">Voltage (V)</span>
			<div class="flex items-center gap-2">
				<span class="text-gray-800">: {convertedCurrentReading.toFixed(4)}</span>
				<UnitSelector
					groupName="Voltage"
					initialUnit={voltageUnitState.unit}
					initialPrefix={voltageUnitState.prefix}
					on:change={(e) => voltageUnitStore.set(e.detail)}
				/>
			</div>
		</div>

		<div class="flex items-center justify-between">
			<span class="text-sm text-gray-700">Magnetic Field (B)</span>
			<div class="flex items-center gap-2">
				<span class="text-gray-800">: {convertedCurrentMagnetic.toFixed(4)}</span>
				<UnitSelector
					groupName="Magnetic Field"
					initialUnit={magneticFieldUnitState.unit}
					initialPrefix={magneticFieldUnitState.prefix}
					on:change={(e) => magneticFieldUnitStore.set(e.detail)}
				/>
			</div>
		</div>

		<div class="flex items-center justify-between">
			<span class="text-sm text-gray-700">Initial Voltage (V0)</span>
			<div class="flex items-center gap-2">
				<span class="text-gray-800">: {convertedInitialVoltage.toFixed(4)}</span>
				<UnitSelector
					groupName="Voltage"
					initialUnit={initialVoltageUnitState.unit}
					initialPrefix={initialVoltageUnitState.prefix}
					on:change={(e) => initialVoltageUnitStore.set(e.detail)}
				/>
			</div>
		</div>
	</div>

		<!-- Action Buttons -->
	<div class="flex gap-3">
		<button class="flex-1 py-3 bg-blue-200/70 rounded-xl text-sm shadow-md">
			Undo
		</button>
		<button class="flex-1 py-3 bg-blue-200/70 rounded-xl text-sm shadow-md">
			Reset
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
						>{voltageUnitLabel}</th
					>
					<th class="px-3 py-2 text-center text-sm text-gray-700">
						{magneticUnitLabel}
					</th>
				</tr>
			</thead>
			<tbody>
				{#each convertedTableData as row, i}
					<tr class="border-t border-blue-100">
						<td class="px-3 py-3 text-sm text-center">{i + 1}</td>
						<td class="px-3 py-3 text-sm text-center">{row.voltage.toFixed(4)}</td>
						<td class="px-3 py-3 text-sm text-center">{row.magneticfield.toFixed(4)}</td>
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
				{stats} 
				xUnitState={magneticFieldUnitState}
				yUnitState={voltageUnitState}
			/>
		</div>
	</div>
</div>
