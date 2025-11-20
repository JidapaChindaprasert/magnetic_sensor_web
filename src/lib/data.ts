// Re-export for backward compatibility
export type { HalleffectData } from './data/halleffect.rawdata';
export { stats } from './data/halleffect.rawdata';

// Export stats store and helper functions
export { 
	statsStore,
	undoLastRow,
	resetAllData,
	addTestData
} from './data/stats.store';
export {
	initializeNewExperiment,
	clearAllData,
	loadExperimentConfig,
	setAxisMapping,
	type ExperimentConfig,
	type ExperimentAxis
} from './data/stats.store';

// Export unit state stores
export { 
	xAxisUnitStore,
	yAxisUnitStore,
	initialVoltageUnitStore,
	voltageUnitStore, // Backward compatibility
	magneticFieldUnitStore, // Backward compatibility
	type UnitState 
} from './data/unitState.store';
