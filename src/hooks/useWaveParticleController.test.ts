import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useWaveParticleController } from './useWaveParticleController';

describe('useWaveParticleController', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize controller', () => {
    const canvas = document.createElement('canvas');
    const { result } = renderHook(() => useWaveParticleController(canvas));
    expect(result.current).toBeDefined();
    expect(result.current.controller).toBeDefined();
  });

  it('should handle null canvas', () => {
    const { result } = renderHook(() => useWaveParticleController(null));
    expect(result.current).toBeDefined();
  });
});
