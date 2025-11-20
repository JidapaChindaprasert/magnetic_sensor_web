// src/lib/data/halleffect.rawdata.ts

/**
 * Raw experimental data with generic x and y axes.
 */
export interface HalleffectData {
	x: number;
	y: number;
}

export const stats: HalleffectData[] = [
	{ x: 0, y: 0.0032 },
	{ x: 100, y: 0.0501 },
	{ x: 200, y: 0.0948 },
	{ x: 300, y: 0.1450 },
	{ x: 400, y: 0.1905 },
	{ x: 500, y: 0.2382 },
	{ x: 600, y: 0.2840 },
	{ x: 700, y: 0.3301 },
	{ x: 800, y: 0.3778 },
	{ x: 900, y: 0.4205 },
	{ x: 1000, y: 0.4662 },
	{ x: 1100, y: 0.5118 },
	{ x: 1200, y: 0.5569 },
	{ x: 1300, y: 0.6030 },
	{ x: 1400, y: 0.6481 },
	{ x: 1500, y: 0.6910 },
	{ x: 1600, y: 0.7255 },
	{ x: 1700, y: 0.7542 },
	{ x: 1800, y: 0.7781 },
	{ x: 1900, y: 0.7974 },
	{ x: 2000, y: 0.8130 }
];

