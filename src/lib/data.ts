// Re-export for backward compatibility
export type { HalleffectData } from './data/halleffect.rawdata';
export { stats } from './data/halleffect.rawdata';

// Export unit state stores
export { 
	voltageUnitStore, 
	magneticFieldUnitStore, 
	initialVoltageUnitStore,
	type UnitState 
} from './data/unitState.store';
