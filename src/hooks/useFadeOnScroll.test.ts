import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useFadeOnScroll } from './useFadeOnScroll';

describe('useFadeOnScroll', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should calculate fade opacity based on scroll', () => {
    const element = document.createElement('div');
    const { result } = renderHook(() => useFadeOnScroll(element));
    expect(result.current).toBeDefined();
    expect(result.current.opacity).toBeGreaterThanOrEqual(0);
    expect(result.current.opacity).toBeLessThanOrEqual(1);
  });

  it('should handle null element', () => {
    const { result } = renderHook(() => useFadeOnScroll(null));
    expect(result.current).toBeDefined();
  });
});
