<script lang="ts">
	import * as d3 from "d3";
	import type { PopulationData } from '$lib/data.ts';

	export let stats: PopulationData[];
	export let xAccessorScaled: (d: PopulationData) => number;
	export let yAccessorScaled: (d: PopulationData) => number;

	const interpolation = d3.curveMonotoneX;

	$: lineGenerator = d3
		.line<PopulationData>()
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
