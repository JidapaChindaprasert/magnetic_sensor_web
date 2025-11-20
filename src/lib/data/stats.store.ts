// src/lib/data/stats.store.ts
import { writable } from 'svelte/store';
import { stats as initialStats, type HalleffectData } from './halleffect.rawdata';

const STORAGE_KEY_STATS = 'hall_effect_stats';
const STORAGE_KEY_EXPERIMENT_CONFIG = 'hall_experiment_config';

// Migration function to convert old data format to new format
function migrateOldData(data: any[]): HalleffectData[] {
	if (!data || data.length === 0) return [];
	
	// Check if data is already in new format
	if (data[0] && 'x' in data[0] && 'y' in data[0]) {
		return data as HalleffectData[];
	}
	
	// Check if data is in old format
	if (data[0] && 'magneticfield' in data[0] && 'voltage' in data[0]) {
		return data.map((item: any) => ({
			x: item.magneticfield ?? 0,
			y: item.voltage ?? 0
		}));
	}
	
	// Unknown format, return empty array
	console.warn('Unknown data format, cannot migrate');
	return [];
}

// Helper function to load from localStorage
function loadFromStorage(): HalleffectData[] {
	if (typeof window === 'undefined') return initialStats;
	
	try {
		const saved = localStorage.getItem(STORAGE_KEY_STATS);
		if (saved) {
			const parsed = JSON.parse(saved);
			// Migrate old data format if needed
			return migrateOldData(parsed);
		}
	} catch (e) {
		console.warn('Failed to parse saved stats', e);
	}
	return initialStats;
}

// Helper function to save to localStorage
function saveToStorage(value: HalleffectData[]): void {
	if (typeof window === 'undefined') return;
	
	try {
		localStorage.setItem(STORAGE_KEY_STATS, JSON.stringify(value));
	} catch (e) {
		console.warn('Failed to save stats', e);
	}
}

// Create writable store with localStorage persistence
export const statsStore = writable<HalleffectData[]>(loadFromStorage());

// Subscribe to changes and save to localStorage
statsStore.subscribe((value) => {
	saveToStorage(value);
});

// Helper functions
export function undoLastRow() {
	statsStore.update(stats => {
		if (stats.length > 0) {
			return stats.slice(0, -1);
		}
		return stats;
	});
}

export function resetAllData() {
	// Keep for compatibility: only clear the in-memory store
	statsStore.set([]);
}

export function addTestData(x: number, y: number) {
	statsStore.update(stats => {
		return [...stats, { x, y }];
	});
}

// Experiment config and management
export interface ExperimentAxis {
	name: string;
	unit: string;
	prefix: string;
}

export interface ExperimentConfig {
	id: string;
	name?: string;
	description?: string;
	createdAt: string;
	axis: { x: ExperimentAxis; y: ExperimentAxis };
}

export function loadExperimentConfig(): ExperimentConfig | null {
	if (typeof window === 'undefined') return null;
	try {
		const raw = localStorage.getItem(STORAGE_KEY_EXPERIMENT_CONFIG);
		if (!raw) return null;
		const parsed = JSON.parse(raw);
		// Migrate old config format if needed
		const migrated = migrateOldConfig(parsed);
		if (migrated && migrated !== parsed) {
			// Save migrated config
			localStorage.setItem(STORAGE_KEY_EXPERIMENT_CONFIG, JSON.stringify(migrated));
		}
		return migrated;
	} catch (e) {
		console.warn('Failed to parse experiment config', e);
		return null;
	}
}

export function initializeNewExperiment(config: ExperimentConfig, initialStats?: HalleffectData[]) {
	if (typeof window === 'undefined') return;
	try {
		localStorage.setItem(STORAGE_KEY_EXPERIMENT_CONFIG, JSON.stringify(config));
		if (typeof initialStats !== 'undefined') {
			localStorage.setItem(STORAGE_KEY_STATS, JSON.stringify(initialStats));
			statsStore.set(initialStats);
		} else {
			// Remove saved stats so that loadFromStorage will fallback to bundled initialStats
			localStorage.removeItem(STORAGE_KEY_STATS);
			statsStore.set(loadFromStorage());
		}
	} catch (e) {
		console.warn('Failed to initialize experiment', e);
	}
}

export function setAxisMapping(axis: { x: ExperimentAxis; y: ExperimentAxis }) {
	if (typeof window === 'undefined') return;
	try {
		const cfg = loadExperimentConfig();
		if (!cfg) return;
		cfg.axis = axis;
		localStorage.setItem(STORAGE_KEY_EXPERIMENT_CONFIG, JSON.stringify(cfg));
	} catch (e) {
		console.warn('Failed to set axis mapping', e);
	}
}

// Migration function for old ExperimentConfig format
export function migrateOldConfig(config: any): ExperimentConfig | null {
	if (!config) return null;
	
	// Check if already in new format
	if (config.axis && config.axis.x && config.axis.x.name && !config.axis.x.fieldName) {
		return config as ExperimentConfig;
	}
	
	// Migrate from old format
	try {
		const newConfig: ExperimentConfig = {
			id: config.id || String(Date.now()),
			name: config.name,
			description: config.description,
			createdAt: config.createdAt || new Date().toISOString(),
			axis: {
				x: {
					name: config.axis?.x?.fieldName === 'magneticfield' ? 'Magnetic Field' : config.axis?.x?.fieldName || 'X Axis',
					unit: config.axis?.x?.unitSymbol || config.initialUnits?.magnetic?.unit || 'G',
					prefix: config.axis?.x?.prefixSymbol || config.initialUnits?.magnetic?.prefix || ''
				},
				y: {
					name: config.axis?.y?.fieldName === 'voltage' ? 'Voltage' : config.axis?.y?.fieldName || 'Y Axis',
					unit: config.axis?.y?.unitSymbol || config.initialUnits?.voltage?.unit || 'V',
					prefix: config.axis?.y?.prefixSymbol || config.initialUnits?.voltage?.prefix || ''
				}
			}
		};
		return newConfig;
	} catch (e) {
		console.warn('Failed to migrate old config', e);
		return null;
	}
}

export function clearAllData() {
	if (typeof window === 'undefined') return;
	try {
		// Remove stats and experiment config
		localStorage.removeItem(STORAGE_KEY_STATS);
		localStorage.removeItem(STORAGE_KEY_EXPERIMENT_CONFIG);

		// Remove unit preference keys from unitState.store
		localStorage.removeItem('global_voltage_unit');
		localStorage.removeItem('global_magnetic_unit');
		localStorage.removeItem('global_initial_voltage_unit');
		localStorage.removeItem('global_x_axis_unit');
		localStorage.removeItem('global_y_axis_unit');

		// Reset in-memory stores
		statsStore.set([]);
	} catch (e) {
		console.warn('Failed to clear all data', e);
	}
}

