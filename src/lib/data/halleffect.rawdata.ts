// src/lib/data/halleffect.rawdata.ts

/**
 * Raw experimental data for a Hall effect sensor.
 * - magneticfield: Measured in Gauss (G)
 * - voltage: Measured in Volts (V)
 */
export interface HalleffectData {
	magneticfield: number; // Gauss
	voltage: number; // Volts
}

export const stats: HalleffectData[] = [
	{ magneticfield: 0, voltage: 0.0032 },
	{ magneticfield: 100, voltage: 0.0501 },
	{ magneticfield: 200, voltage: 0.0948 },
	{ magneticfield: 300, voltage: 0.1450 },
	{ magneticfield: 400, voltage: 0.1905 },
	{ magneticfield: 500, voltage: 0.2382 },
	{ magneticfield: 600, voltage: 0.2840 },
	{ magneticfield: 700, voltage: 0.3301 },
	{ magneticfield: 800, voltage: 0.3778 },
	{ magneticfield: 900, voltage: 0.4205 },
	{ magneticfield: 1000, voltage: 0.4662 },
	{ magneticfield: 1100, voltage: 0.5118 },
	{ magneticfield: 1200, voltage: 0.5569 },
	{ magneticfield: 1300, voltage: 0.6030 },
	{ magneticfield: 1400, voltage: 0.6481 },
	{ magneticfield: 1500, voltage: 0.6910 },
	{ magneticfield: 1600, voltage: 0.7255 },
	{ magneticfield: 1700, voltage: 0.7542 },
	{ magneticfield: 1800, voltage: 0.7781 },
	{ magneticfield: 1900, voltage: 0.7974 },
	{ magneticfield: 2000, voltage: 0.8130 }
];

