// src/lib/data/units.data.ts
import { rawPrefixes, rawUnitGroups, type RawUnit } from './units.rawdata';

// --- 1. Processed Data Structures ---

export interface Prefix {
	symbol: string;
	factor: number;
}
export interface Unit {
	symbol: string;
	name: string;
	toBase: (val: number) => number;
	fromBase: (val: number) => number;
}

// A Map for fast prefix lookup by symbol (e.g., 'k' -> { symbol: 'k', factor: 1e3 })
export const prefixMap = new Map<string, Prefix>();
rawPrefixes.forEach((p) => {
	prefixMap.set(p.symbol, { symbol: p.symbol, factor: p.factor });
});

// An ordered list of prefix symbols for the UI arrows
export const prefixSymbols = [...prefixMap.values()]
	.sort((a, b) => b.factor - a.factor)
	.map((p) => p.symbol); // ['G', 'M', 'k', '', 'm', 'u']

// A Map for fast lookup of unit groups
interface UnitGroup {
	name: string;
	baseUnit: string;
	units: Map<string, Unit>; // Key: unit symbol ('T', 'G', 'A/m')
}
export const unitGroups = new Map<string, UnitGroup>();
rawUnitGroups.forEach((group) => {
	const processedGroup: UnitGroup = {
		name: group.name,
		baseUnit: group.baseUnit,
		units: new Map<string, Unit>()
	};
	group.units.forEach((u) => {
		processedGroup.units.set(u.symbol, {
			symbol: u.symbol,
			name: u.name,
			toBase: u.toBase,
			fromBase: u.fromBase
		});
	});
	unitGroups.set(group.name, processedGroup);
});

// --- 2. Service Layer Functions (Public API) ---

/**
 * Gets the UI-ready list of units for a specific group.
 * @param groupName The name of the unit group (e.g., 'Magnetic Field')
 */
export function getUnitsForUi(groupName: string): { symbol: string; name: string }[] {
	const group = unitGroups.get(groupName);
	if (!group) return [];
	return Array.from(group.units.values()).map((u) => ({ symbol: u.symbol, name: u.name }));
}

/**
 * Finds the next or previous prefix in the ordered list.
 * @param currentPrefixSymbol The current prefix symbol (e.g., 'k').
 * @param direction 'up' (to 'M') or 'down' (to 'm').
 */
export function getNextPrefix(currentPrefixSymbol: string, direction: 'up' | 'down'): string {
	const currentIndex = prefixSymbols.indexOf(currentPrefixSymbol);
	if (currentIndex === -1) return currentPrefixSymbol;

	if (direction === 'up') {
		const nextIndex = Math.max(0, currentIndex - 1);
		return prefixSymbols[nextIndex];
	} else {
		const nextIndex = Math.min(prefixSymbols.length - 1, currentIndex + 1);
		return prefixSymbols[nextIndex];
	}
}

/**
 * Converts a value from one unit (with prefix) to another unit (with prefix).
 */
export function convert(
	value: number,
	groupName: string,
	fromUnitSymbol: string,
	fromPrefixSymbol: string,
	toUnitSymbol: string,
	toPrefixSymbol: string
): number | null {
	const group = unitGroups.get(groupName);
	const fromUnit = group?.units.get(fromUnitSymbol);
	const toUnit = group?.units.get(toUnitSymbol);
	const fromPrefix = prefixMap.get(fromPrefixSymbol);
	const toPrefix = prefixMap.get(toPrefixSymbol);

	if (!fromUnit || !toUnit || !fromPrefix || !toPrefix) {
		console.error('Invalid conversion parameters');
		return null;
	}

	// 1. Apply 'from' prefix (e.g., 1 'km' -> 1000 'm')
	const valueInOwnBase = value * fromPrefix.factor;
	// 2. Convert to the group's main base unit (e.g., 'Gauss' -> 'Tesla')
	const valueInGroupBase = fromUnit.toBase(valueInOwnBase);
	// 3. Convert from group base to the target unit's base (e.g., 'Tesla' -> 'A/m')
	const valueInTargetBase = toUnit.fromBase(valueInGroupBase);
	// 4. De-apply the 'to' prefix (e.g., 5000 'm' -> 5 'km')
	const finalValue = valueInTargetBase / toPrefix.factor;

	return finalValue;
}

