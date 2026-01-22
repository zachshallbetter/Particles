import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useScrollAnimation } from './useScrollAnimation';

describe('useScrollAnimation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should provide scroll animation state', () => {
    const element = document.createElement('div');
    const { result } = renderHook(() => useScrollAnimation(element));
    expect(result.current).toBeDefined();
    expect(result.current.isVisible).toBeDefined();
    expect(result.current.progress).toBeDefined();
  });

  it('should handle null element', () => {
    const { result } = renderHook(() => useScrollAnimation(null));
    expect(result.current).toBeDefined();
  });
});
