import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useScrollLockUntilAligned } from './useScrollLockUntilAligned';

describe('useScrollLockUntilAligned', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should lock scroll until aligned', () => {
    const element = document.createElement('div');
    const { result } = renderHook(() => useScrollLockUntilAligned(element));
    expect(result.current).toBeDefined();
    expect(result.current.isLocked).toBeDefined();
  });

  it('should handle null element', () => {
    const { result } = renderHook(() => useScrollLockUntilAligned(null));
    expect(result.current).toBeDefined();
  });
});
