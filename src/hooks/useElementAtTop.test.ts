import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useElementAtTop } from './useElementAtTop';

describe('useElementAtTop', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should detect if element is at top', () => {
    const element = document.createElement('div');
    const { result } = renderHook(() => useElementAtTop(element));
    expect(result.current).toBeDefined();
    expect(typeof result.current).toBe('boolean');
  });

  it('should handle null element', () => {
    const { result } = renderHook(() => useElementAtTop(null));
    expect(result.current).toBe(false);
  });
});
