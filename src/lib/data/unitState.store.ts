// src/lib/data/unitState.store.ts
import { writable } from 'svelte/store';

export interface UnitState {
	unit: string;
	prefix: string;
}

const STORAGE_KEY_X_AXIS = 'global_x_axis_unit';
const STORAGE_KEY_Y_AXIS = 'global_y_axis_unit';
const STORAGE_KEY_VOLTAGE = 'global_voltage_unit'; // Keep for backward compatibility
const STORAGE_KEY_MAGNETIC = 'global_magnetic_unit'; // Keep for backward compatibility
const STORAGE_KEY_INITIAL_VOLTAGE = 'global_initial_voltage_unit'; // Keep for backward compatibility

// Helper function to load from localStorage with migration
function loadFromStorage(key: string, defaultValue: UnitState, migrationKey?: string): UnitState {
	if (typeof window === 'undefined') return defaultValue;
	
	try {
		const saved = localStorage.getItem(key);
		if (saved) {
			return JSON.parse(saved);
		}
		// Try migration from old key if provided
		if (migrationKey) {
			const oldSaved = localStorage.getItem(migrationKey);
			if (oldSaved) {
				const migrated = JSON.parse(oldSaved);
				// Save to new key and return
				localStorage.setItem(key, oldSaved);
				return migrated;
			}
		}
	} catch (e) {
		console.warn(`Failed to parse saved unit state for ${key}`, e);
	}
	return defaultValue;
}

// Helper function to save to localStorage
function saveToStorage(key: string, value: UnitState): void {
	if (typeof window === 'undefined') return;
	
	try {
		localStorage.setItem(key, JSON.stringify(value));
	} catch (e) {
		console.warn(`Failed to save unit state for ${key}`, e);
	}
}

// Create writable stores with localStorage persistence
function createPersistedStore(key: string, defaultValue: UnitState, migrationKey?: string) {
	const store = writable<UnitState>(
		loadFromStorage(key, defaultValue, migrationKey)
	);

	// Subscribe to changes and save to localStorage
	store.subscribe((value) => {
		saveToStorage(key, value);
	});

	return store;
}

// Global unit state stores
export const xAxisUnitStore = createPersistedStore(STORAGE_KEY_X_AXIS, { unit: 'G', prefix: '' }, STORAGE_KEY_MAGNETIC);
export const yAxisUnitStore = createPersistedStore(STORAGE_KEY_Y_AXIS, { unit: 'V', prefix: '' }, STORAGE_KEY_VOLTAGE);
export const initialVoltageUnitStore = createPersistedStore(STORAGE_KEY_INITIAL_VOLTAGE, { unit: 'V', prefix: '' });

// Keep old stores for backward compatibility during transition
export const voltageUnitStore = yAxisUnitStore;
export const magneticFieldUnitStore = xAxisUnitStore;

