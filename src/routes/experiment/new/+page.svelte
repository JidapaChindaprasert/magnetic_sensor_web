<script lang="ts">
    import { goto } from "$app/navigation";
    import { initializeNewExperiment } from "$lib/data.ts";
    import type { ExperimentConfig } from "$lib/data.ts";

    type AxisType = "voltage" | "magnetic" | "other";

    let name = "";
    let description = "";

    // X Axis configuration
    let xAxisType: AxisType = "magnetic";
    let xAxisName = "Magnetic Field";
    let xAxisUnit = "G";
    let xAxisPrefix = "";
    let xOtherName = "";
    let xOtherUnit = "";

    // Y Axis configuration
    let yAxisType: AxisType = "voltage";
    let yAxisName = "Voltage";
    let yAxisUnit = "V";
    let yAxisPrefix = "";
    let yOtherName = "";
    let yOtherUnit = "";

    // Update axis config when type changes
    $: if (xAxisType === "voltage") {
        xAxisName = "Voltage";
        xAxisUnit = "V";
        xAxisPrefix = "";
    } else if (xAxisType === "magnetic") {
        xAxisName = "Magnetic Field";
        xAxisUnit = "G";
        xAxisPrefix = "";
    } else {
        // Other - use custom values
        xAxisName = xOtherName || "X Axis";
        xAxisUnit = xOtherUnit || "";
        xAxisPrefix = "";
    }

    $: if (yAxisType === "voltage") {
        yAxisName = "Voltage";
        yAxisUnit = "V";
        yAxisPrefix = "";
    } else if (yAxisType === "magnetic") {
        yAxisName = "Magnetic Field";
        yAxisUnit = "G";
        yAxisPrefix = "";
    } else {
        // Other - use custom values
        yAxisName = yOtherName || "Y Axis";
        yAxisUnit = yOtherUnit || "";
        yAxisPrefix = "";
    }

    function makeDefaultConfig(): ExperimentConfig {
        return {
            id: String(Date.now()),
            name: name || "New Experiment",
            description,
            createdAt: new Date().toISOString(),
            axis: {
                x: { name: xAxisName, unit: xAxisUnit, prefix: xAxisPrefix },
                y: { name: yAxisName, unit: yAxisUnit, prefix: yAxisPrefix },
            },
        };
    }

    function startWithDefaults() {
        const cfg = makeDefaultConfig();
        initializeNewExperiment(cfg, []);
        goto("/experiment");
    }

    function startFresh() {
        const cfg = makeDefaultConfig();
        initializeNewExperiment(cfg, []);
        goto("/experiment");
    }

    function loadSample() {
        const cfg = makeDefaultConfig();
        // load sample data from halleffect.rawdata via stats store fallback
        initializeNewExperiment(cfg);
        goto("/experiment");
    }
</script>

<div class="p-6 pb-16 space-y-6">
    <h2 class="text-xl mb-4">New Experiment Setup</h2>

    <div class="space-y-4">
        <label class="block">
            <span class="text-sm font-medium text-gray-700"
                >Experiment Name</span
            >
            <input
                bind:value={name}
                class="mt-1 border border-gray-300 rounded-md p-2 w-full"
                placeholder="New Experiment"
            />
        </label>

        <label class="block">
            <span class="text-sm font-medium text-gray-700">Description</span>
            <input
                bind:value={description}
                class="mt-1 border border-gray-300 rounded-md p-2 w-full"
                placeholder="Optional description"
            />
        </label>
    </div>

    <!-- Axis Configuration -->
    <div class="space-y-4 border-t pt-4">
        <h3 class="text-lg font-medium text-gray-800">Axis Configuration</h3>

        <!-- X Axis Configuration -->
        <div class="bg-gray-50 p-4 rounded-lg space-y-3">
            <h4 class="text-sm font-semibold text-gray-700">X Axis</h4>
            <div class="space-y-2">
                <label class="block">
                    <span class="text-sm text-gray-600 mb-1 block"
                        >Axis Type</span
                    >
                    <select
                        bind:value={xAxisType}
                        class="border border-gray-300 rounded-md p-2 w-full"
                    >
                        <option value="voltage">Voltage</option>
                        <option value="magnetic">Magnetic Field</option>
                        <option value="other">Other</option>
                    </select>
                </label>

                {#if xAxisType === "other"}
                    <label class="block">
                        <span class="text-sm text-gray-600">Axis Name</span>
                        <input
                            bind:value={xOtherName}
                            class="mt-1 border border-gray-300 rounded-md p-2 w-full"
                            placeholder="Enter axis name"
                        />
                    </label>
                    <label class="block">
                        <span class="text-sm text-gray-600">Unit</span>
                        <input
                            bind:value={xOtherUnit}
                            class="mt-1 border border-gray-300 rounded-md p-2 w-full"
                            placeholder="e.g., A, m, kg"
                        />
                    </label>
                {/if}
            </div>
        </div>

        <!-- Y Axis Configuration -->
        <div class="bg-gray-50 p-4 rounded-lg space-y-3">
            <h4 class="text-sm font-semibold text-gray-700">Y Axis</h4>
            <div class="space-y-2">
                <label class="block">
                    <span class="text-sm text-gray-600 mb-1 block"
                        >Axis Type</span
                    >
                    <select
                        bind:value={yAxisType}
                        class="border border-gray-300 rounded-md p-2 w-full"
                    >
                        <option value="voltage">Voltage</option>
                        <option value="magnetic">Magnetic Field</option>
                        <option value="other">Other</option>
                    </select>
                </label>

                {#if yAxisType === "other"}
                    <label class="block">
                        <span class="text-sm text-gray-600">Axis Name</span>
                        <input
                            bind:value={yOtherName}
                            class="mt-1 border border-gray-300 rounded-md p-2 w-full"
                            placeholder="Enter axis name"
                        />
                    </label>
                    <label class="block">
                        <span class="text-sm text-gray-600">Unit</span>
                        <input
                            bind:value={yOtherUnit}
                            class="mt-1 border border-gray-300 rounded-md p-2 w-full"
                            placeholder="e.g., A, m, kg"
                        />
                    </label>
                {/if}
            </div>
        </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex gap-2 pt-4 border-t">
        <button
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            on:click={startWithDefaults}>Start with defaults</button
        >
        <button
            class="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
            on:click={startFresh}>Start fresh</button
        >
        <button
            class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            on:click={loadSample}>Load sample data</button
        >
    </div>
</div>
