// src/lib/data/halleffect.data.ts
import { stats as rawStats } from './halleffect.rawdata';
import { convert } from './units.data'; // <-- Connects to the other "brain"

// Define the units of the raw data
const SOURCE_UNIT_GROUP = 'Magnetic Field';
const SOURCE_UNIT_SYMBOL = 'G'; // The raw data is in Gauss
const SOURCE_PREFIX_SYMBOL = ''; // No prefix

export interface ProcessedHalleffectData {
	magneticfield: number | null; // The *converted* magnetic field
	voltage: number;
}

/**
 * Gets all Hall effect stats, with the magnetic field converted to the
 * specified unit and prefix.
 *
 * @param targetUnitSymbol The unit to convert to (e.g., 'T', 'A/m')
 * @param targetPrefixSymbol The prefix for the target unit (e.g., 'm' for milli)
 * @returns A new array with the magnetic field values processed.
 */
export function getStatsInUnit(
	targetUnitSymbol: string,
	targetPrefixSymbol: string
): ProcessedHalleffectData[] {
	// Process the raw data
	const processedData = rawStats.map((dataPoint) => {
		// Use the converter from our other 'data.ts' file
		const convertedMagField = convert(
			dataPoint.magneticfield,
			SOURCE_UNIT_GROUP,
			SOURCE_UNIT_SYMBOL,
			SOURCE_PREFIX_SYMBOL,
			targetUnitSymbol,
			targetPrefixSymbol
		);

		return {
			magneticfield: convertedMagField,
			voltage: dataPoint.voltage
		};
	});

	return processedData;
}

