import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useWaveParticles } from './useWaveParticles';

describe('useWaveParticles', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize wave particles', () => {
    const { result } = renderHook(() => useWaveParticles());
    expect(result.current).toBeDefined();
  });

  it('should provide wave particle controls', () => {
    const { result } = renderHook(() => useWaveParticles());
    expect(result.current.waves).toBeDefined();
    expect(result.current.particles).toBeDefined();
    expect(result.current.addWave).toBeDefined();
    expect(result.current.removeWave).toBeDefined();
  });

  it('should handle wave addition', () => {
    const { result } = renderHook(() => useWaveParticles());
    result.current.addWave({ amplitude: 50, frequency: 0.02 });
    expect(result.current.waves.length).toBeGreaterThan(0);
  });

  it('should handle wave removal', () => {
    const { result } = renderHook(() => useWaveParticles());
    const waveId = result.current.addWave({ amplitude: 50, frequency: 0.02 });
    result.current.removeWave(waveId);
    expect(result.current.waves.length).toBe(0);
  });
});
