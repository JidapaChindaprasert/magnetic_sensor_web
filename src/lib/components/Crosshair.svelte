<script lang="ts">
	import * as d3 from "d3";

	export let xAccessorScaled: number;
	export let yAccessorScaled: number;
	export let xLabel: number;
	export let yLabel: number;
	export let innerHeight: number;
	export let innerWidth: number;
	export let isMobile: boolean = false;
	export let isSmall: boolean = false;

	const formatXLabel = d3.format(".2f");  // Magnetic field: 2 decimal places
	const formatYLabel = d3.format(".2f");  // Voltage: 2 decimal places

	$: fontSize = isSmall ? "10px" : isMobile ? "11px" : "13px";
	$: strokeWidth = isSmall ? 5 : isMobile ? 6 : 8;
	$: labelStrokeWidth = isSmall ? 2 : isMobile ? 2 : 3;

	// Prevent crosshair labels from going off-screen
	$: xLabelPosition = Math.max(
		30,
		Math.min(innerWidth - 30, xAccessorScaled),
	);
	$: yLabelVisible =
		yAccessorScaled > 15 && yAccessorScaled < innerHeight - 15;
</script>

<g transform={`translate(${xAccessorScaled} 0)`}>
	<text
		class="stroke-white"
		style="stroke-width: {strokeWidth}px; font-size: {fontSize};"
		y={innerHeight + 10}
		dy="0.8em"
		text-anchor="middle"
	>
		{formatXLabel(xLabel)}
	</text>
	<text
		class="fill-[#dc267f]"
		style="font-size: {fontSize}; font-weight: 600;"
		y={innerHeight + 10}
		dy="0.8em"
		text-anchor="middle"
	>
		{formatXLabel(xLabel)}
	</text>
	<line
		class="stroke-white"
		style="stroke-width: {labelStrokeWidth}px;"
		x1={0}
		x2={0}
		y1={yAccessorScaled}
		y2={innerHeight}
	/>
	<line
		class="stroke-[#dc267f]"
		style="stroke-width: 1px;"
		x1={0}
		x2={0}
		y1={yAccessorScaled}
		y2={innerHeight}
	/>
</g>

{#if yLabelVisible}
	<g transform={`translate(0 ${yAccessorScaled})`}>
		<text
			class="stroke-white"
			style="stroke-width: {strokeWidth}px; font-size: {fontSize};"
			dx={-10}
			dy="0.34em"
			text-anchor="end"
		>
			{formatYLabel(yLabel)}
		</text>
		<text
			class="fill-[#dc267f]"
			style="font-size: {fontSize}; font-weight: 600;"
			dx={-10}
			dy="0.34em"
			text-anchor="end"
		>
			{formatYLabel(yLabel)}
		</text>
		<line
			class="stroke-white"
			style="stroke-width: {labelStrokeWidth}px;"
			x1={xAccessorScaled}
			x2={0}
			y1={0}
			y2={0}
		/>
		<line
			class="stroke-[#dc267f]"
			style="stroke-width: 1px;"
			x1={xAccessorScaled}
			x2={0}
			y1={0}
			y2={0}
		/>
	</g>
{/if}
