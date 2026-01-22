import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useElementParticles } from './useElementParticles';

describe('useElementParticles', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize element particles', () => {
    const element = document.createElement('div');
    const { result } = renderHook(() => useElementParticles(element));
    expect(result.current).toBeDefined();
    expect(result.current.particles).toBeDefined();
  });

  it('should handle null element', () => {
    const { result } = renderHook(() => useElementParticles(null));
    expect(result.current).toBeDefined();
  });
});
