import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useWaves } from './useWaves';

describe('useWaves', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize waves', () => {
    const { result } = renderHook(() => useWaves());
    expect(result.current).toBeDefined();
  });

  it('should provide wave controls', () => {
    const { result } = renderHook(() => useWaves());
    expect(result.current.waves).toBeDefined();
    expect(result.current.addWave).toBeDefined();
    expect(result.current.removeWave).toBeDefined();
    expect(result.current.updateWave).toBeDefined();
  });

  it('should add waves', () => {
    const { result } = renderHook(() => useWaves());
    result.current.addWave({ amplitude: 50, frequency: 0.02, speed: 0.5 });
    expect(result.current.waves.length).toBeGreaterThan(0);
  });

  it('should remove waves', () => {
    const { result } = renderHook(() => useWaves());
    const waveId = result.current.addWave({ amplitude: 50, frequency: 0.02 });
    result.current.removeWave(waveId);
    expect(result.current.waves.length).toBe(0);
  });

  it('should update waves', () => {
    const { result } = renderHook(() => useWaves());
    const waveId = result.current.addWave({ amplitude: 50, frequency: 0.02 });
    result.current.updateWave(waveId, { amplitude: 100 });
    const wave = result.current.waves.find((w) => w.id === waveId);
    expect(wave?.amplitude).toBe(100);
  });
});
