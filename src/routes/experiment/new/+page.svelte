<script lang="ts">
    import { goto } from '$app/navigation';
    import { initializeNewExperiment } from '$lib/data.ts';
    import type { ExperimentConfig } from '$lib/data.ts';

    let name = '';
    let description = '';

    // default units
    const defaultVol = { unit: 'V', prefix: '' };
    const defaultMag = { unit: 'G', prefix: '' };

    function makeDefaultConfig(): ExperimentConfig {
        return {
            id: String(Date.now()),
            name: name || 'New Experiment',
            description,
            createdAt: new Date().toISOString(),
            initialUnits: { voltage: defaultVol, magnetic: defaultMag },
            axis: {
                x: { fieldName: 'magneticfield', unitSymbol: 'G', prefixSymbol: '' },
                y: { fieldName: 'voltage', unitSymbol: 'V', prefixSymbol: '' }
            }
        };
    }

    function startWithDefaults() {
        const cfg = makeDefaultConfig();
        initializeNewExperiment(cfg, []);
        goto('/experiment');
    }

    function startFresh() {
        const cfg = makeDefaultConfig();
        initializeNewExperiment(cfg, []);
        goto('/experiment');
    }

    function loadSample() {
        const cfg = makeDefaultConfig();
        // load sample data from halleffect.rawdata via stats store fallback
        initializeNewExperiment(cfg);
        goto('/experiment');
    }
</script>

<div class="p-6">
    <h2 class="text-xl mb-4">New Experiment Setup</h2>

    <label class="block mb-2">Name
        <input bind:value={name} class="border p-2 w-full" />
    </label>

    <label class="block mb-4">Description
        <input bind:value={description} class="border p-2 w-full" />
    </label>

    <div class="flex gap-2">
        <button class="px-4 py-2 bg-blue-600 text-white rounded" on:click={startWithDefaults}>Start with defaults</button>
        <button class="px-4 py-2 bg-yellow-500 text-white rounded" on:click={startFresh}>Start fresh</button>
        <button class="px-4 py-2 bg-green-600 text-white rounded" on:click={loadSample}>Load sample data</button>
    </div>
</div>
