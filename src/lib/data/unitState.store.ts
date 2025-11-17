// src/lib/data/unitState.store.ts
import { writable } from 'svelte/store';

export interface UnitState {
	unit: string;
	prefix: string;
}

const STORAGE_KEY_VOLTAGE = 'global_voltage_unit';
const STORAGE_KEY_MAGNETIC = 'global_magnetic_unit';
const STORAGE_KEY_INITIAL_VOLTAGE = 'global_initial_voltage_unit';

// Helper function to load from localStorage
function loadFromStorage(key: string, defaultValue: UnitState): UnitState {
	if (typeof window === 'undefined') return defaultValue;
	
	try {
		const saved = localStorage.getItem(key);
		if (saved) {
			return JSON.parse(saved);
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
function createPersistedStore(key: string, defaultValue: UnitState) {
	const store = writable<UnitState>(
		loadFromStorage(key, defaultValue)
	);

	// Subscribe to changes and save to localStorage
	store.subscribe((value) => {
		saveToStorage(key, value);
	});

	return store;
}

// Global unit state stores
export const voltageUnitStore = createPersistedStore(STORAGE_KEY_VOLTAGE, { unit: 'V', prefix: '' });
export const magneticFieldUnitStore = createPersistedStore(STORAGE_KEY_MAGNETIC, { unit: 'G', prefix: '' });
export const initialVoltageUnitStore = createPersistedStore(STORAGE_KEY_INITIAL_VOLTAGE, { unit: 'V', prefix: '' });

