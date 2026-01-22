export * from './wave.types';
export * from './theme.types';
export * from './colors.types';
export * from './wave-control.types';

// Re-export WaveTypes namespace for backward compatibility
import * as WaveTypesModule from './wave.types';
export const WaveTypes = WaveTypesModule;
