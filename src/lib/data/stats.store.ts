// src/lib/data/stats.store.ts
import { writable } from 'svelte/store';
import { stats as initialStats, type HalleffectData } from './halleffect.rawdata';

const STORAGE_KEY_STATS = 'hall_effect_stats';
const STORAGE_KEY_EXPERIMENT_CONFIG = 'hall_experiment_config';

// Helper function to load from localStorage
function loadFromStorage(): HalleffectData[] {
	if (typeof window === 'undefined') return initialStats;
	
	try {
		const saved = localStorage.getItem(STORAGE_KEY_STATS);
		if (saved) {
			return JSON.parse(saved);
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

export function addTestData(magneticfield: number, voltage: number) {
	statsStore.update(stats => {
		return [...stats, { magneticfield, voltage }];
	});
}

// Experiment config and management
export interface ExperimentAxis {
	fieldName: string;
	unitSymbol: string;
	prefixSymbol: string;
}

export interface ExperimentConfig {
	id: string;
	name?: string;
	description?: string;
	createdAt: string;
	initialUnits: {
		voltage: { unit: string; prefix: string };
		magnetic: { unit: string; prefix: string };
	};
	axis: { x: ExperimentAxis; y: ExperimentAxis };
}

export function loadExperimentConfig(): ExperimentConfig | null {
	if (typeof window === 'undefined') return null;
	try {
		const raw = localStorage.getItem(STORAGE_KEY_EXPERIMENT_CONFIG);
		return raw ? JSON.parse(raw) : null;
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

		// Reset in-memory stores
		statsStore.set([]);
	} catch (e) {
		console.warn('Failed to clear all data', e);
	}
}

