<script lang="ts">
	import * as d3 from "d3";
	import type { HalleffectData } from '$lib/data.ts';

	export let stats: HalleffectData[];
	export let xAccessorScaled: (d: HalleffectData) => number;
	export let yAccessorScaled: (d: HalleffectData) => number;

	const interpolation = d3.curveMonotoneX;

	$: lineGenerator = d3
		.line<HalleffectData>()
		.x(xAccessorScaled)
		.y(yAccessorScaled)
		.curve(interpolation);

	$: line = lineGenerator(stats);
</script>

<path
	class="fill-none stroke-[#4427ca] stroke-[3px]"
	style="stroke-linecap: round;"
	d={line}
/>
