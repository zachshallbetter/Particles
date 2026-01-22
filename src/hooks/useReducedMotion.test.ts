import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useReducedMotion } from './useReducedMotion';

describe('useReducedMotion', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should detect reduced motion preference', () => {
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBeDefined();
    expect(typeof result.current).toBe('boolean');
  });
});
