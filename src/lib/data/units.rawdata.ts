// src/lib/data/units.rawdata.ts

// 1. Defines the raw scientific prefixes
export const rawPrefixes = [
	{ name: 'Kilo', symbol: 'k', factor: 1e3 },
	{ name: 'None', symbol: '', factor: 1 }, // Base unit (no prefix)
	{ name: 'Milli', symbol: 'm', factor: 1e-3 },
];

// --- Unit Definitions ---

export interface RawUnit {
	symbol: string;
	name: string;
	baseUnit: string; // The base unit this unit converts to/from (e.g., 'T' for magnetic field units)
	toBase: (val: number) => number;
	fromBase: (val: number) => number;
}

const MU_0 = 4 * Math.PI * 1e-7; // Permeability of free space

// 2. Defines all units as a flat list
export const rawUnits: RawUnit[] = [
	// Magnetic Field units (base: T)
	{
		symbol: 'T',
		name: 'Tesla',
		baseUnit: 'T',
		toBase: (val) => val,
		fromBase: (val) => val
	},
	{
		symbol: 'G',
		name: 'Gauss',
		baseUnit: 'T',
		toBase: (val) => val * 1e-4, // 1 G = 1e-4 T
		fromBase: (val) => val / 1e-4 // 1 T = 10,000 G
	},
	{
		symbol: 'A/m',
		name: 'Ampere/meter',
		baseUnit: 'T',
		toBase: (val) => val * MU_0, // B = μ₀ * H
		fromBase: (val) => val / MU_0 // H = B / μ₀
	},
	// Voltage units (base: V)
	{
		symbol: 'V',
		name: 'Volt',
		baseUnit: 'V',
		toBase: (val) => val,
		fromBase: (val) => val
	}
	// Add more units here as needed
];

