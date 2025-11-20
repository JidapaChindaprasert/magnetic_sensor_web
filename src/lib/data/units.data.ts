// src/lib/data/units.data.ts
import { rawPrefixes, rawUnits, type RawUnit } from './units.rawdata';

// --- 1. Processed Data Structures ---

export interface Prefix {
	symbol: string;
	factor: number;
}
export interface Unit {
	symbol: string;
	name: string;
	baseUnit: string;
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
	.map((p) => p.symbol); // ['k', '', 'm']

// A Map for fast lookup of units by symbol
export const unitMap = new Map<string, Unit>();
rawUnits.forEach((u) => {
	unitMap.set(u.symbol, {
		symbol: u.symbol,
		name: u.name,
		baseUnit: u.baseUnit,
		toBase: u.toBase,
		fromBase: u.fromBase
	});
});

// Get all units that share the same base unit (compatible units)
function getCompatibleUnits(baseUnit: string): Unit[] {
	return Array.from(unitMap.values()).filter(u => u.baseUnit === baseUnit);
}

// --- 2. Service Layer Functions (Public API) ---

/**
 * Gets the UI-ready list of units compatible with the given unit.
 * @param unitSymbol The unit symbol to find compatible units for (e.g., 'G' or 'V')
 */
export function getUnitsForUi(unitSymbol: string): { symbol: string; name: string }[] {
	const unit = unitMap.get(unitSymbol);
	if (!unit) return [];
	return getCompatibleUnits(unit.baseUnit).map((u) => ({ symbol: u.symbol, name: u.name }));
}

/**
 * Finds the next or previous prefix in the ordered list.
 * @param currentPrefixSymbol The current prefix symbol (e.g., 'k').
 * @param direction 'up' (to larger prefix) or 'down' (to smaller prefix).
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
 * Units must share the same baseUnit to be convertible.
 * If units are not in the unitMap (custom/other units), returns the value as-is.
 */
export function convert(
	value: number,
	fromUnitSymbol: string,
	fromPrefixSymbol: string,
	toUnitSymbol: string,
	toPrefixSymbol: string
): number | null {
	const fromUnit = unitMap.get(fromUnitSymbol);
	const toUnit = unitMap.get(toUnitSymbol);
	const fromPrefix = prefixMap.get(fromPrefixSymbol);
	const toPrefix = prefixMap.get(toPrefixSymbol);

	// If either unit is not in the map (custom unit), return value as-is
	if (!fromUnit || !toUnit) {
		// Custom units - no conversion possible, return as-is
		return value;
	}

	if (!fromPrefix || !toPrefix) {
		console.error('Invalid prefix parameters');
		return null;
	}

	// Check if units are compatible (share same base unit)
	if (fromUnit.baseUnit !== toUnit.baseUnit) {
		console.error(`Cannot convert between ${fromUnitSymbol} and ${toUnitSymbol} - different base units`);
		return null;
	}

	// 1. Apply 'from' prefix (e.g., 1 'km' -> 1000 'm')
	const valueInOwnBase = value * fromPrefix.factor;
	// 2. Convert to the shared base unit (e.g., 'Gauss' -> 'Tesla')
	const valueInBaseUnit = fromUnit.toBase(valueInOwnBase);
	// 3. Convert from base unit to the target unit (e.g., 'Tesla' -> 'A/m')
	const valueInTargetBase = toUnit.fromBase(valueInBaseUnit);
	// 4. De-apply the 'to' prefix (e.g., 5000 'm' -> 5 'km')
	const finalValue = valueInTargetBase / toPrefix.factor;

	return finalValue;
}

