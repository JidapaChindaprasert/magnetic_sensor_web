<script lang="ts">
  import type { ScaleLinear } from 'd3';
  import type { HalleffectData } from '$lib/data.ts';

  export let xScale: ScaleLinear<number, number>;
  export let innerHeight: number;
  export let hoveredPoint: HalleffectData | null;
  export let name: string;
  export let unit: string;
  export let prefix: string;
  export let isMobile: boolean = false;
  export let isSmall: boolean = false;

  const numberOfTicks = (pixelsAvailable: number): number => {
    const pixelsPerTick = isSmall ? 90 : isMobile ? 80 : 100;
    return Math.max(3, Math.floor(Math.abs(pixelsAvailable) / pixelsPerTick));
  };

  $: [xMin, xMax] = xScale.range();
  $: ticks = xScale.ticks(numberOfTicks(xMax - xMin));
  $: fontSize = isSmall ? '9px' : isMobile ? '10px' : '12px';
  $: labelOffset = isSmall ? 40 : isMobile ? 38 : 45;
  $: labelFontSize = isSmall ? '10px' : isMobile ? '11px' : '13px';
  $: unitLabel = prefix && unit
    ? `${name} (${prefix}${unit})`
    : unit
    ? `${name} (${unit})`
    : name;
</script>

<g transform={`translate(0 ${innerHeight})`}>
  <line x1={xMin} x2={xMax} y1={0} y2={0} stroke='#bdc3c7' />
  {#each ticks as tick}
    <g transform={`translate(${xScale(tick)} 0)`}>
      <line y1={0} y2={6} stroke='#bdc3c7' />
      <text
        y={10}
        dy="0.8em"
        text-anchor="middle"
        class={hoveredPoint ? 'text-[#bdc3c7]' : 'text-[#282828]'}
        style="font-size: {fontSize};"
      >
        {tick}
      </text>
    </g>
  {/each}
  <text
    x={xScale.range()[1] / 2}
    text-anchor="middle"
    y={labelOffset}
    class="fill-[#282828]"
    style="font-size: {labelFontSize}; font-weight: 500;"
  >
    {unitLabel}
  </text>
</g>
