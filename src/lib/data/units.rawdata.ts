// src/lib/data/units.rawdata.ts

// 1. Defines the raw scientific prefixes
export const rawPrefixes = [
	{ name: 'Giga', symbol: 'G', factor: 1e9 },
	{ name: 'Mega', symbol: 'M', factor: 1e6 },
	{ name: 'Kilo', symbol: 'k', factor: 1e3 },
	{ name: 'None', symbol: '', factor: 1 }, // Base unit (no prefix)
	{ name: 'Milli', symbol: 'm', factor: 1e-3 },
	{ name: 'Micro', symbol: 'μ', factor: 1e-6 }
];

// --- Unit Definitions ---

export interface RawUnit {
	symbol: string;
	name: string;
	toBase: (val: number) => number;
	fromBase: (val: number) => number;
}

export interface RawUnitGroup {
	name: string;
	baseUnit: string;
	units: RawUnit[];
}

const MU_0 = 4 * Math.PI * 1e-7; // Permeability of free space

// 2. Defines all unit conversion groups
export const rawUnitGroups: RawUnitGroup[] = [
	{
		name: 'Magnetic Field',
		baseUnit: 'T',
		units: [
			{
				symbol: 'T',
				name: 'Tesla',
				toBase: (val) => val,
				fromBase: (val) => val
			},
			{
				symbol: 'G',
				name: 'Gauss',
				toBase: (val) => val * 1e-4, // 1 G = 1e-4 T
				fromBase: (val) => val / 1e-4 // 1 T = 10,000 G
			},
			{
				symbol: 'A/m',
				name: 'Ampere/meter',
				toBase: (val) => val * MU_0, // B = μ₀ * H
				fromBase: (val) => val / MU_0 // H = B / μ₀
			}
		]
	},
	{
		name: 'Voltage',
		baseUnit: 'V',
		units: [
			{
				symbol: 'V',
				name: 'Volt',
				toBase: (val) => val,
				fromBase: (val) => val
			}
			// You could add 'mV', 'kV' here if they weren't prefixes
		]
	}
	// Add more groups like 'Current', 'Distance' etc. here
];

