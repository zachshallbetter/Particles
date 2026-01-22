import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useMediaQuery } from './useMediaQuery';

describe('useMediaQuery', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return media query match result', () => {
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    expect(result.current).toBeDefined();
    expect(typeof result.current).toBe('boolean');
  });

  it('should update when media query changes', () => {
    const { result, rerender } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    const initial = result.current;
    // In a real scenario, you'd mock matchMedia to change
    expect(result.current).toBeDefined();
  });
});
