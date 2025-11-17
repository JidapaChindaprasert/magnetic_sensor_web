<script lang="ts">
	import * as d3 from "d3";
	import type { HalleffectData } from "$lib/data.ts";
	import { stats as rawStats } from "$lib/data/halleffect.rawdata";
	import { convert } from "$lib/data/units.data";
	import Line from "./Line.svelte";
	import XAxis from "./XAxis.svelte";
	import GridLines from "./GridLines.svelte";
	import Crosshair from "./Crosshair.svelte";
	import Point from "./Point.svelte";

	export let stats: HalleffectData[];
	export let xUnitState: { unit: string; prefix: string } = { unit: 'G', prefix: '' };
	export let yUnitState: { unit: string; prefix: string } = { unit: 'V', prefix: '' };

	let hoveredPoint: HalleffectData | null = null;
	let containerWidth = 100;
	let isMobile = false;
	let isSmall = false;

	// Responsive margins - more space for labels
	$: isSmall = containerWidth < 480;
	$: isMobile = containerWidth < 640;
	$: margin = isSmall
		? { top: 40, right: 30, bottom: 65, left: 70 }
		: isMobile
			? { top: 45, right: 35, bottom: 70, left: 75 }
			: { top: 50, right: 50, bottom: 70, left: 80 };

	// Responsive dimensions
	$: height = isSmall
		? containerWidth * 1.0
		: isMobile
			? containerWidth * 0.8
			: containerWidth * 0.5;
	$: innerWidth = Math.max(0, containerWidth - margin.left - margin.right);
	$: innerHeight = Math.max(0, height - margin.top - margin.bottom);

	// Convert data reactively based on unit states
	$: convertedStats = rawStats.map((dataPoint) => {
		// Convert magnetic field (X-axis) from Gauss to selected unit
		const convertedMagField = convert(
			dataPoint.magneticfield,
			'Magnetic Field',
			'G', // source unit
			'', // source prefix
			xUnitState.unit,
			xUnitState.prefix
		);

		// Convert voltage (Y-axis) from Volts to selected unit
		const convertedVoltage = convert(
			dataPoint.voltage,
			'Voltage',
			'V', // source unit
			'', // source prefix
			yUnitState.unit,
			yUnitState.prefix
		);

		return {
			magneticfield: convertedMagField ?? dataPoint.magneticfield,
			voltage: convertedVoltage ?? dataPoint.voltage
		};
	});

	const xAccessor = (d: HalleffectData): number => d.magneticfield;
	const yAccessor = (d: HalleffectData): number => d.voltage;
	const bisectX = d3.bisector(xAccessor).left;

	$: xScale = d3
		.scaleLinear()
		.domain(d3.extent(convertedStats, xAccessor) as [number, number])
		.range([0, innerWidth]);

	$: yScale = d3
		.scaleLinear()
		.domain(d3.extent(convertedStats, yAccessor) as [number, number])
		.range([innerHeight, 0])
		.nice();

	$: xAccessorScaled = (d: HalleffectData): number => xScale(xAccessor(d));
	$: yAccessorScaled = (d: HalleffectData): number => yScale(yAccessor(d));

	const handleMouseMove = (event: MouseEvent): void => {
		const rect = (
			event.currentTarget as SVGSVGElement
		).getBoundingClientRect();
		const xCoordinate = xScale.invert(
			event.clientX - rect.left - margin.left,
		);
		const index = bisectX(convertedStats, xCoordinate);
		hoveredPoint = convertedStats[index - 1] || convertedStats[index] || null;
	};

	const handleTouchMove = (event: TouchEvent): void => {
		event.preventDefault();
		const touch = event.touches[0];
		const rect = (
			event.currentTarget as SVGSVGElement
		).getBoundingClientRect();
		const xCoordinate = xScale.invert(
			touch.clientX - rect.left - margin.left,
		);
		const index = bisectX(convertedStats, xCoordinate);
		hoveredPoint = convertedStats[index - 1] || convertedStats[index] || null;
	};

	const handleMouseLeave = (): void => {
		hoveredPoint = null;
	};
</script>

<div class="relative w-full flex-1" bind:clientWidth={containerWidth}>
	<div class="d3-chart-container">
		<svg
			role="img"
			aria-label="line chart showing voltage vs magnetic field"
			width={containerWidth}
			{height}
			on:mousemove={handleMouseMove}
			on:mouseleave={handleMouseLeave}
			on:touchmove={handleTouchMove}
			on:touchend={handleMouseLeave}
			class="touch-none"
		>
		<g transform={`translate(${margin.left}, ${margin.top})`}>
			<XAxis
				{xScale}
				{innerHeight}
				{hoveredPoint}
				label="Magnetic Field"
				unitSymbol={xUnitState.unit}
				prefixSymbol={xUnitState.prefix}
				{isMobile}
				{isSmall}
				{containerWidth}
			/>
			<GridLines
				{yScale}
				{innerWidth}
				{hoveredPoint}
				label="Voltage"
				unitSymbol={yUnitState.unit}
				prefixSymbol={yUnitState.prefix}
				{isMobile}
				{isSmall}
			/>
			<Line stats={convertedStats} {xAccessorScaled} {yAccessorScaled} />
			{#if hoveredPoint}
				<Crosshair
					xAccessorScaled={xAccessorScaled(hoveredPoint)}
					yAccessorScaled={yAccessorScaled(hoveredPoint)}
					xLabel={xAccessor(hoveredPoint)}
					yLabel={yAccessor(hoveredPoint)}
					{innerHeight}
					{innerWidth}
					{isMobile}
					{isSmall}
				/>
				<Point
					x={xAccessorScaled(hoveredPoint)}
					y={yAccessorScaled(hoveredPoint)}
					color="#dc267f"
				/>
			{/if}
		</g>
	</svg>
	</div>
</div>
