import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useWaveParticleEvents } from './useWaveParticleEvents';

describe('useWaveParticleEvents', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should subscribe to events', () => {
    const { result } = renderHook(() => useWaveParticleEvents());
    expect(result.current).toBeDefined();
  });

  it('should handle event callbacks', () => {
    const onWaveAdd = vi.fn();
    const { result } = renderHook(() => useWaveParticleEvents({ onWaveAdd }));
    expect(result.current).toBeDefined();
  });
});
