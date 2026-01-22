import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { usePageScroll } from './usePageScroll';

describe('usePageScroll', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return page scroll information', () => {
    const { result } = renderHook(() => usePageScroll());
    expect(result.current).toBeDefined();
    expect(result.current.scrollY).toBeDefined();
    expect(result.current.scrollProgress).toBeDefined();
  });

  it('should calculate scroll progress', () => {
    const { result } = renderHook(() => usePageScroll());
    expect(result.current.scrollProgress).toBeGreaterThanOrEqual(0);
    expect(result.current.scrollProgress).toBeLessThanOrEqual(1);
  });
});
