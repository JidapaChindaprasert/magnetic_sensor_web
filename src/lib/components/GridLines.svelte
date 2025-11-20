<script lang="ts">
	import * as d3 from "d3";
	import type { ScaleLinear } from "d3";
	import type { HalleffectData } from "$lib/data.ts";

	export let yScale: ScaleLinear<number, number>;
	export let innerWidth: number;
	export let hoveredPoint: HalleffectData | null;
	export let name: string;
	export let unit: string;
	export let prefix: string;
	export let isMobile: boolean = false;
	export let isSmall: boolean = false;

	const formatTick = d3.format(".2s");

	const numberOfTicks = (pixelsAvailable: number): number => {
		const pixelsPerTick = isSmall ? 45 : isMobile ? 50 : 60;
		return Math.max(
			3,
			Math.floor(Math.abs(pixelsAvailable) / pixelsPerTick),
		);
	};

	$: [yMin, yMax] = yScale.range();
	$: ticks = yScale.ticks(numberOfTicks(yMax - yMin));
	$: fontSize = isSmall ? "9px" : isMobile ? "10px" : "12px";
	$: labelOffset = isSmall ? -20 : isMobile ? -22 : -35;
	$: labelFontSize = isSmall ? "10px" : isMobile ? "11px" : "13px";
	$: unitLabel = prefix && unit
		? `${name} (${prefix}${unit})`
		: unit
		? `${name} (${unit})`
		: name;
</script>

<g>
	{#each ticks as tick}
		<g transform={`translate(0 ${yScale(tick)})`}>
			<line
				x1={0}
				x2={innerWidth}
				stroke="#bdc3c7"
				stroke-opacity="0.5"
			/>
			<text
				dx={-10}
				dy="0.34em"
				text-anchor="end"
				class={hoveredPoint ? "fill-[#bdc3c7]" : "fill-[#282828]"}
				style="font-size: {fontSize};"
			>
				{formatTick(tick)}
			</text>
		</g>
	{/each}
	<text
		x={-50}
		y={labelOffset}
		dy="0.8em"
		text-anchor="start"
		class="fill-[#282828]"
		style="font-size: {labelFontSize}; font-weight: 500;"
	>
		{unitLabel}
	</text>
</g>
