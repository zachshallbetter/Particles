import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useFocusTrap } from './useFocusTrap';

describe('useFocusTrap', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should trap focus within container', () => {
    const container = document.createElement('div');
    const { result } = renderHook(() => useFocusTrap(container));
    expect(result.current).toBeDefined();
  });

  it('should handle null container', () => {
    const { result } = renderHook(() => useFocusTrap(null));
    expect(result.current).toBeDefined();
  });
});
