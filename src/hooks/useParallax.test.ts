import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useParallax } from './useParallax';

describe('useParallax', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should calculate parallax offset', () => {
    const element = document.createElement('div');
    const { result } = renderHook(() => useParallax(element, 0.5));
    expect(result.current).toBeDefined();
    expect(result.current.offsetY).toBeDefined();
  });

  it('should handle null element', () => {
    const { result } = renderHook(() => useParallax(null, 0.5));
    expect(result.current).toBeDefined();
  });
});
