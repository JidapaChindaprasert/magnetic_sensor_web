<script lang="ts">
	import {
		ChevronLeft,
		LineChart,
		ChartSpline,
		ChartColumnBig,
		ChartNetwork,
		EllipsisVertical,
		Image,
		FileSpreadsheet
	} from "lucide-svelte";

	import { statsStore, loadExperimentConfig, xAxisUnitStore, yAxisUnitStore, type ExperimentConfig, type UnitState } from "$lib/data.ts";
	import LineGraph from "$lib/components/LineChart.svelte";
	import DropdownMenu from "$lib/components/DropdownMenu.svelte";
	import { onMount } from 'svelte';
	import { unitMap, convert, prefixMap } from "$lib/data/units.data.ts";

	// Load experiment config
	let experimentConfig: ExperimentConfig | null = null;

	// Use reactive stats store - Svelte 5 auto-subscription
	$: stats = $statsStore;
	$: baseXAxisConfig = experimentConfig?.axis.x || { name: 'X Axis', unit: 'G', prefix: '' };
	$: baseYAxisConfig = experimentConfig?.axis.y || { name: 'Y Axis', unit: 'V', prefix: '' };

	// Get current unit states
	let xAxisUnitState: UnitState = { unit: 'G', prefix: '' };
	let yAxisUnitState: UnitState = { unit: 'V', prefix: '' };

	// Subscribe to stores
	xAxisUnitStore.subscribe(value => xAxisUnitState = value);
	yAxisUnitStore.subscribe(value => yAxisUnitState = value);

	// Check if units are known
	$: xAxisUnitKnown = unitMap.has(baseXAxisConfig.unit);
	$: yAxisUnitKnown = unitMap.has(baseYAxisConfig.unit);

	// Create axis configs with current prefix from stores for graph
	$: xDisplayUnit = xAxisUnitKnown && unitMap.has(xAxisUnitState.unit) ? xAxisUnitState.unit : baseXAxisConfig.unit;
	$: xDisplayPrefix = xAxisUnitKnown && unitMap.has(xAxisUnitState.unit) ? xAxisUnitState.prefix : xAxisUnitState.prefix;
	$: xAxisConfig = {
		name: baseXAxisConfig.name,
		unit: xDisplayUnit,
		prefix: xDisplayPrefix
	};

	$: yDisplayUnit = yAxisUnitKnown && unitMap.has(yAxisUnitState.unit) ? yAxisUnitState.unit : baseYAxisConfig.unit;
	$: yDisplayPrefix = yAxisUnitKnown && unitMap.has(yAxisUnitState.unit) ? yAxisUnitState.prefix : yAxisUnitState.prefix;
	$: yAxisConfig = {
		name: baseYAxisConfig.name,
		unit: yDisplayUnit,
		prefix: yDisplayPrefix
	};

	// Helper function for prefix-only conversion (for arbitrary units)
	function convertPrefixOnly(value: number, fromPrefix: string, toPrefix: string): number {
		const fromPrefixFactor = prefixMap.get(fromPrefix)?.factor ?? 1;
		const toPrefixFactor = prefixMap.get(toPrefix)?.factor ?? 1;
		// Convert: apply from prefix, then remove to prefix
		return (value * fromPrefixFactor) / toPrefixFactor;
	}

	// Convert stats for graph display
	$: convertedStatsForGraph = stats.map((row) => {
		const convertedY = yAxisUnitKnown && unitMap.has(yAxisUnitState.unit)
			? convert(
				row.y,
				baseYAxisConfig.unit,
				baseYAxisConfig.prefix,
				yAxisUnitState.unit,
				yAxisUnitState.prefix
			)
			: convertPrefixOnly(
				row.y,
				baseYAxisConfig.prefix,
				yAxisUnitState.prefix
			);

		const convertedX = xAxisUnitKnown && unitMap.has(xAxisUnitState.unit)
			? convert(
				row.x,
				baseXAxisConfig.unit,
				baseXAxisConfig.prefix,
				xAxisUnitState.unit,
				xAxisUnitState.prefix
			)
			: convertPrefixOnly(
				row.x,
				baseXAxisConfig.prefix,
				xAxisUnitState.prefix
			);

		return {
			x: convertedX ?? row.x,
			y: convertedY ?? row.y
		};
	});

	onMount(() => {
		experimentConfig = loadExperimentConfig();
	});

	interface MenuItem {
		label: string;
		icon?: any;
		iconClass?: string;
		color?: string;
		svg?: string;
		onclick?: () => void | Promise<void>;
	}

	// Save stats as CSV
	const saveChartAsCsv = (): void => {
		const dataToSave = $statsStore;

		if (!dataToSave || dataToSave.length === 0) {
			console.warn("No data to save as CSV.");
			alert("No data available to export.");
			return;
		}

		// Use axis names from config for headers
		const xAxisName = experimentConfig?.axis.x.name || 'X';
		const yAxisName = experimentConfig?.axis.y.name || 'Y';
		const headers = `${xAxisName},${yAxisName}`;
		const rows = dataToSave.map((obj) => `${obj.x},${obj.y}`);
		const csvContent = [headers, ...rows].join("\n");

		const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
		const url = window.URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = "chart_data.csv";
		link.click();
		window.URL.revokeObjectURL(url);
		link.remove();
	};

	// Save chart as PNG
	const saveChartAsPng = async (): Promise<void> => {
		const graphContainer = document.querySelector(".d3-chart-container") as HTMLElement | null;

		if (!graphContainer) {
			console.warn("Could not find graph container element.");
			alert("PNG export is not available. Graph container not found.");
			return;
		}

		try {
			const html2canvas = (await import("html2canvas")).default;
			const canvas = await html2canvas(graphContainer);
			const pngUrl = canvas.toDataURL("image/png");

			const link = document.createElement("a");
			link.href = pngUrl;
			link.download = "chart.png";
			link.click();
			link.remove();

			console.log("Chart saved as PNG successfully.");
		} catch (error) {
			console.error("Error saving chart as PNG:", error);
			alert("Failed to save chart as PNG. Please try again.");
		}
	};

	const chartMenuItems: MenuItem[] = [
		{
			label: "Curve Fit",
			icon: ChartSpline,
			color: "#60A5FA",
			iconClass: "w-4 h-4 sm:w-5 sm:h-5",
		},
		{
			label: "Integral",
			icon: null,
			iconClass: "w-4 h-4 sm:w-5 sm:h-5",
			svg: `
				<svg width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" focusable="false">
					<path d="M5,19l.38.76a2.24,2.24,0,0,0,2+1.24h0a2.24,2.24,0,0,0,2.13-1.53L12,12l2.49-7.47A2.24,2.24,0,0,1,16.62,3h0a2.24,2.24,0,0,1,2+1.24L19,5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
				</svg>
			`,
			color: "#60A5FA",
		},
		{
			label: "Statistics",
			icon: ChartColumnBig,
			iconClass: "w-4 h-4 sm:w-5 sm:h-5",
			color: "#60A5FA",
		},
		{
			label: "Interpolation",
			icon: ChartNetwork,
			iconClass: "w-4 h-4 sm:w-5 sm:h-5",
			color: "#60A5FA",
		},
	];

	const exportMenuItems: MenuItem[] = [
		{
			label: "Export Data as CSV",
			icon: FileSpreadsheet,
			color: "#60A5FA",
			iconClass: "w-4 h-4 sm:w-5 sm:h-5",
			onclick: saveChartAsCsv,
		},
		{
			label: "Export Graph as PNG",
			icon: Image,
			color: "#60A5FA",
			iconClass: "w-4 h-4 sm:w-5 sm:h-5",
			onclick: saveChartAsPng,
		},
	];

</script>

<div class="flex flex-col h-screen bg-stone-100">
	<nav
		class="flex items-center justify-between w-full p-4 bg-white shadow-sm flex-shrink-0"
	>
		<div class="flex items-center gap-2 sm:gap-3">
			<a href="/experiment" class="hover:bg-gray-100 rounded-full p-1 transition">
				<ChevronLeft class="w-5 h-5 sm:w-6 sm:h-6" />
			</a>
			<p class="text-sm sm:text-base font-medium">กราฟแสดงข้อมูล</p>
		</div>
		<div class="flex items-center gap-3 sm:gap-4">
			<DropdownMenu items={chartMenuItems}>
				<svelte:fragment slot="icon">
					<LineChart color="#60A5FA" class="w-5 h-5 sm:w-6 sm:h-6" />
				</svelte:fragment>
			</DropdownMenu>
			<DropdownMenu items={exportMenuItems}>
				<svelte:fragment slot="icon">
					<EllipsisVertical color="#60A5FA" class="w-5 h-5 sm:w-6 sm:h-6" />
				</svelte:fragment>
			</DropdownMenu>
		</div>
	</nav>
	
	<div class="flex-1 overflow-auto bg-blue-50">
		<div class="h-full w-full flex justify-start items-start">
			<LineGraph stats={convertedStatsForGraph} xAxis={xAxisConfig} yAxis={yAxisConfig} />
		</div>
	</div>
</div>
